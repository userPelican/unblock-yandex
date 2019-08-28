
const STORAGE = {
    proxySet: {
        domains: ['vk.*', '*.vk.*', 'vk-cdn.*', '*.vk-cdn.*', 'vkontakte.ru', '*.vkontakte.ru', 'vkuservideo.*', '*.vkuservideo.*', 'vkuserlive.*', '*.vkuserlive.*', 'userapi.com', 'apivk.com', 'yandex.*', '*.yandex.*', '*.yandex', 'ya.ru', '*.ya.ru', 'ya.cc', '*.ya.cc', 'bk.ru', '*.bk.ru', 'yandex-launcher.com', 'yandexdatafactory.ru', 'yandexlauncher.com', 'yandexlyceum.ru', 'yandextrafik.com.tr', 'yandex-school.ru', 'yandexdatafactory.com', 'yandexdataschool.*', 'yandex-ad.cn', 'yandexadexchange.net', 'yaani.ru', 'yandex-amp.net', '*.yandex-amp.net', '*.yandex-launcher.com', '*.yandexdatafactory.ru', '*.yandexlauncher.com', '*.yandexlyceum.ru', '*.yandextrafik.com.tr', '*.yandex-school.ru', '*.yandexdatafactory.com', '*.yandexdataschool.*', '*.yandex-ad.cn', '*.yandexadexchange.net', 'webvisor.*', '*.webvisor.*', 'avto.ru', 'auto.ru', 'autoru.tv', 'ok.com', 'ok.ru', 'ok.me', '*.ok.ru', '*.ok.me', '*.ok.com', 'odnoklassniki.*', '*.odnoklassniki.*', 'mail.ua', '*.mail.ua', 'appsmail.ru', 'attachmail.ru', 'datacloudmail.ru', 'distribmail.ru', 'owamail.ru', 'portal.mail.ru', '*.mail.ru', 'imgsmail.ru', '*.imgsmail.ru', 'mail.ru', 'cldmail.ru', 'cdnmail.ru', '*.appsmail.ru', '*.attachmail.ru', '*.datacloudmail.ru', '*.distribmail.ru', '*.owamail.ru', '*.portal.mail.ru', '*.cldmail.ru', '*.cdnmail.ru', 'kinopoisk.ru', '*.kinopoisk.ru', 'yandex.*', '*.yandex.*', '*.yandex', 'vk.*', '*.vk.*', 'kaspersky.*'],
        proxyList: ['91.208.39.70:8080', 'HTTPS frpxa.com:443', 'HTTPS brwpks.com:443', 'HTTPS pksfr.com:443', 'HTTPS brwpx.com:443']
    }
}

function randomizeProxyStr(proxyList) {
    let randProxyList = proxyList.slice();
    //Fisher-Yates shuffle
    for (let i = proxyList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // swap i and j in array
        [randProxyList[i], randProxyList[j]] = [randProxyList[j], randProxyList[i]]
    }
    return randProxyList.join('; ')
}

function generatePac() {
    let pacScript = ''
    pacScript += 'function FindProxyForURL(url, host) { '
    pacScript += `const domains = ${JSON.stringify(STORAGE.proxySet.domains)}; `
    pacScript += 'for(let i = 0; i < domains.length; i++) { '
    pacScript += '  if (shExpMatch(host, domains[i])) {'
    pacScript += `      return "${randomizeProxyStr(STORAGE.proxySet.proxyList)};" } } `
    pacScript += 'return "DIRECT" }'

    return pacScript;
}

function setProxy() {
    const pacScript = generatePac()

    const config = {
        mode: "pac_script",
        pacScript: {
            data: pacScript
        }
    }

    chrome.proxy.settings.clear({ scope: 'regular' }, () => {
        chrome.proxy.settings.set({ value: config, scope: 'regular' })
        chrome.proxy.onProxyError.addListener((err) => {
            console.log(err)
        });
        chrome.webRequest.handlerBehaviorChanged(function () { })
    })
}

setProxy();