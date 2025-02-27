import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { ClientConfigContext } from '../state/config';
import { Helmet } from "react-helmet";
import { siteName } from '../utils/constants';
import { useTranslation } from "react-i18next";
import { useLoginModal } from '../hooks/useLoginModal';

type ThemeMode = 'light' | 'dark' | 'system';
function Footer() {
    const { t } = useTranslation()
    const [modeState, setModeState] = useState<ThemeMode>('system');
    const config = useContext(ClientConfigContext);
    const footerHtml = config.get<string>('footer');
    const loginEnabled = config.get<boolean>('login.enabled');
    const [doubleClickTimes, setDoubleClickTimes] = useState(0);
    const { LoginModal, setIsOpened } = useLoginModal()
    useEffect(() => {
        const mode = localStorage.getItem('theme') as ThemeMode || 'system';
        setModeState(mode);
        setMode(mode);
    }, [])    
    useEffect(() => {
    // 引入不蒜子计数器
    const script = document.createElement("script");
    script.src = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;
    document.body.appendChild(script);
    }, []);    

    const setMode = (mode: ThemeMode) => {
        setModeState(mode);
        localStorage.setItem('theme', mode);


        if (mode !== 'system' || (!('theme' in localStorage) && window.matchMedia(`(prefers-color-scheme: ${mode})`).matches)) {
            document.documentElement.setAttribute('data-color-mode', mode);
        } else {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            if (mediaQuery.matches) {
                document.documentElement.setAttribute('data-color-mode', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-mode', 'light');
            }
        }
        window.dispatchEvent(new Event("colorSchemeChange"));
    };

    return (
        <footer>
            <Helmet>
                <link rel="alternate" type="application/rss+xml" title={siteName} href="/sub/rss.xml" />
                <link rel="alternate" type="application/atom+xml" title={siteName} href="/sub/atom.xml" />
                <link rel="alternate" type="application/json" title={siteName} href="/sub/rss.json" />
            </Helmet>
            <div className="flex flex-col mb-8 space-y-2 justify-center items-center t-primary ani-show">
                {footerHtml && <div dangerouslySetInnerHTML={{ __html: footerHtml }} />}
                    {/*移动夜间模式位置*/}
                    <div className="w-fit-content inline-flex rounded-full border border-zinc-200 p-[3px] dark:border-zinc-700">
                    <ThemeButton mode='light' current={modeState} label="Toggle light mode" icon="ri-sun-line" onClick={setMode} />
                    <ThemeButton mode='system' current={modeState} label="Toggle system mode" icon="ri-computer-line" onClick={setMode} />
                    <ThemeButton mode='dark' current={modeState} label="Toggle dark mode" icon="ri-moon-line" onClick={setMode} /></div>
                    <p className='text-sm text-neutral-500 font-normal link-line text-center'>
                    {/* 添加站点访问量统计代码 */}                        
总浏览量 <span id="busuanzi_value_site_pv"></span> | 总访客数 <span id="busuanzi_value_site_uv"></span><br/>
                    {/*添加备案信息*/}
<br/> <a className='hover:underline' href="https://beian.miit.gov.cn" target="_blank">冀ICP备2024090725号</a><br/><a className='hover:underline' href="https://beian.mps.gov.cn/#/query/webSearch?code=13073302000040" target="_blank"><img src="https://beian.mps.gov.cn/web/assets/logo01.6189a29f.png" alt="备案图标" style={{ display: 'inline-block', width: '16px', height: '16px', verticalAlign: 'middle', marginRight: '4px' }} />冀公网安备13073302000040</a><br/>                   
                    <span onDoubleClick={() => {
                        if(doubleClickTimes >= 2){ // actually need 3 times doubleClick
                            setDoubleClickTimes(0)
                            if(!loginEnabled) {
                                setIsOpened(true)
                            }
                        } else {
                            setDoubleClickTimes(doubleClickTimes + 1)
                        }
                    }}>
                        © 2024 <a className='hover:underline' href="https://www.kafuchino.top" target="_blank">Chino</a>
                    </span>
                    {config.get<boolean>('rss') && <>
                        <Spliter />
                        <Popup trigger={
                            <button className="hover:underline" type="button">
                                RSS
                            </button>
                        }
                            position="top center"
                            arrow={false}
                            closeOnDocumentClick>
                            <div className="border-card">
                                <p className='font-bold t-primary'>
                                    {t('footer.rss')}
                                </p>
                                <p>
                                    <a href='/sub/rss.xml'>
                                        RSS
                                    </a> <Spliter />
                                    <a href='/sub/atom.xml'>
                                        Atom
                                    </a> <Spliter />
                                    <a href='/sub/rss.json'>
                                        JSON
                                    </a>
                                </p>

                            </div>
                        </Popup> 
                    </>}                    
                     <br/>
                {/*添加萌备信息*/}
        <a className='hover:underline' href="https://icp.gov.moe/?keyword=20243666" target="_blank"><span className="icon-MOE"/>萌ICP备20243666号</a> | <a className='hover:underline' href="https://travel.moe/go.html?travel=on" title="异次元之旅-跃迁-我们一起去萌站成员的星球旅行吧！" target="_blank">异次元之旅</a>
        <br/>Powered by <a className='hover:underline' href="https://github.com/kafuneri/Rin" target="_blank">Rin</a> & <a className='hover:underline' href="https://www.cloudflare.com" target="_blank">Cloudflare</a>
                    </p>               
            </div>  
            <LoginModal />
        </footer>
    );
}

function Spliter() {
    return (<span className='px-1'>
        |
    </span>
    )
}

function ThemeButton({ current, mode, label, icon, onClick }: { current: ThemeMode, label: string, mode: ThemeMode, icon: string, onClick: (mode: ThemeMode) => void }) {
    return (<button aria-label={label} type="button" onClick={() => onClick(mode)}
        className={`rounded-inherit inline-flex h-[32px] w-[32px] items-center justify-center border-0 t-primary ${current === mode ? "bg-w rounded-full shadow-xl shadow-light" : ""}`}>
        <i className={`${icon}`} />
    </button>)
}

export default Footer;
