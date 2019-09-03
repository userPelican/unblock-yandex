

class Proxy {

    constructor() {

        this.domains = STORAGE.proxySet.domains
        this.proxyList = STORAGE.proxySet.proxyList

        this.pacScript = this.generatePacScript()

    }



    randomizeProxyStr(proxyList) {

        let randProxyList = proxyList.slice();

        //Fisher-Yates shuffle
        for (let i = proxyList.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));
            // swap i and j in array
            [randProxyList[i], randProxyList[j]] = [randProxyList[j], randProxyList[i]]

        }

        return randProxyList.join('; ')

    }



    generatePacScript() {

        let pacScript = ''
        pacScript += 'function FindProxyForURL(url, host) { '
        pacScript += `const domains = ${JSON.stringify(this.domains)}; `
        pacScript += 'for(let i = 0; i < domains.length; i++) { '
        pacScript += '  if (shExpMatch(host, domains[i])) {'
        pacScript += `      return "${this.randomizeProxyStr(this.proxyList)};" } } `
        pacScript += 'return "DIRECT" }'

        return pacScript;

    }



    setProxy() {

        const config = {
            mode: "pac_script",
            pacScript: {
                data: this.pacScript
            }
        }

        chrome.proxy.settings.clear({ scope: 'regular' }, () => {

            chrome.proxy.settings.set({ value: config, scope: 'regular' })
            chrome.proxy.onProxyError.addListener(err => {

                console.log(err)

            })

        })
    }

}
