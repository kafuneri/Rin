let counting = false;

export async function fetchCountAndUpdateUI(isFeed = false) {
  if (counting) return;
  counting = true;
  const currentURL = window.location.href;

  const response = await fetch('https://api.obdo.cc/count/api', {
    method: 'POST',
    headers: {
      'X-Bsz-Referer': currentURL
    }
  });
  const jsonResponse: any = await response.json();
  if (jsonResponse.success) {
    updateUI(jsonResponse.data, isFeed);
  }
  counting = false;
}

function updateUI(data: { page_pv: any; page_uv: any; site_pv: any; site_uv: any; } | null, isFeed: boolean, startTime = Date.now()) {
    if (data === null) {
        return;
    }
  
    const { page_pv, page_uv, site_pv, site_uv } = data;
  
    const pagePvElements = document.querySelectorAll('#page_pv');
    const pageUvElements = document.querySelectorAll('#page_uv');
    const sitePvElements = document.querySelectorAll('#site_pv');
    const siteUvElements = document.querySelectorAll('#site_uv');
  
    if (isFeed && pagePvElements.length === 0) {
      setTimeout(() => updateUI(data, isFeed, startTime), 100);
      return;
    }
  
    pagePvElements.forEach(element => element.textContent = page_pv.toString());
    pageUvElements.forEach(element => element.textContent = page_uv.toString());
    sitePvElements.forEach(element => element.textContent = site_pv.toString());
    siteUvElements.forEach(element => element.textContent = site_uv.toString());
    counting = false;
}
