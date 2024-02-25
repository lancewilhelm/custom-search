const newtab = {
    async init () {
        console.log('newtab init')
        url = browser.runtime.getURL('search.html');

        // Used to focus on the page
        // Adapted this approach from the extension New Tab Override
        await browser.tabs.getCurrent((tab) => {
            const tabId = tab.id;

            browser.tabs.create({url : url, cookieStoreId: tab.cookieStoreId}, (tab) => {
                console.log('newtab created')
                browser.tabs.remove(tabId, () => {
                    console.log('old tab removed')
                });
            });
        });
    }
}

newtab.init();