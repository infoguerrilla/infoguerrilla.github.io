---
title: DNS sobre HTTPS
description: Tradução
date: 2023-08-25 00:00:00+0000
image: image.jpg
tags:
- privacidade
- segurança
- DNS
categories:
- privacidade
- segurança
- tradução
---

> **Nota:** Este artigo é uma tradução do artigo original "DNS over HTTPS and DNS over TLS" do site da Mullvad. Link do artigo original: [DNS over HTTPS and DNS over TLS](https://mullvad.net/en/help/dns-over-https-and-dns-over-tls/)

>
>Tradução: **Geraldo Homero do Couto Neto** | [ORCID](https://orcid.org/0000-0001-6686-7182) | [Lattes](http://lattes.cnpq.br/9924558848538635) | [LinkedIn](https://www.linkedin.com/in/geraldohomero/) | [Instagram](https://www.instagram.com/geraldohomero/) | [X](https://twitter.com/geraldohomero)

> Use o `índice` ao lado para navegar entre as seções e encontrar o que você procura mais facilmente.

---  

# Serviço de DNS Público Criptografado

Nosso serviço de DNS público criptografado utiliza DNS over HTTPS (DoH) e DNS over TLS (DoT). Isso protege suas consultas DNS contra espionagem por terceiros quando você não está conectado ao nosso serviço VPN, pois suas consultas DNS são criptografadas entre seu dispositivo e nosso servidor DNS.

**Este serviço é destinado principalmente para ser usado quando você está desconectado do nosso serviço VPN**, ou em dispositivos onde não é possível ou desejável conectar-se à VPN. Quando você já está conectado ao nosso serviço VPN, os benefícios de segurança do uso de DNS criptografado são negligenciáveis e sempre será mais lento do que usar o resolvedor DNS no servidor VPN ao qual você está conectado.

Você pode usar este serviço de privacidade mesmo que não seja cliente Mullvad.

## Recursos do serviço de DNS criptografado Mullvad

Este serviço fornece consultas DNS criptografadas com os seguintes recursos:

- **Bloqueio de conteúdo**: Fornecemos opções básicas de bloqueio de conteúdo para bloquear anúncios, rastreadores, malware, conteúdo adulto, jogos de azar e mídias sociais.
- **Minimização de QNAME**: Isso permite que nossos servidores DNS resolvam suas consultas enquanto fornecem o mínimo possível de informações sobre as consultas a outros servidores DNS envolvidos no processo de resolução.
- **Serviço Anycast**: Vários servidores Mullvad em diferentes localizações são configurados para fornecer o mesmo serviço DNS. Suas consultas DNS são roteadas para o servidor geograficamente mais próximo, embora peering e roteamento entre provedores de Internet possam afetar isso. Se o servidor mais próximo estiver totalmente offline, suas consultas serão roteadas para o segundo mais próximo e assim por diante.

Um resolvedor DNS limitado está ouvindo na porta UDP/TCP 53, apenas para ajudar a resolver nomes de host relacionados a este serviço (dns.mullvad.net, adblock.mullvad.net e assim por diante), para que os clientes possam primeiro resolver o IP do resolvedor antes de consultá-lo por DNS criptografado.

Para saber mais sobre as tecnologias do serviço, consulte os links abaixo.

- [Wikipedia: Anycast](https://en.wikipedia.org/wiki/Anycast)
- [Wikipedia: DNS over TLS](https://en.wikipedia.org/wiki/DNS_over_TLS)
- [Wikipedia: DNS over HTTPS](https://en.wikipedia.org/wiki/DNS_over_HTTPS)
- [Minimização de QNAME](https://www.isc.org/blogs/qname-minimization-and-privacy)

## Especificações

### Nomes de host e bloqueadores de conteúdo

A tabela abaixo mostra as diferentes opções de nome de host e seus bloqueadores de conteúdo. Consulte isso ao configurar o DNS com as instruções abaixo.

| Nome de host | Anúncios | Rastreadores | Malware | Adulto | Jogos de azar | Mídias sociais |
|---|---|---|---|---|---|---|
| dns.mullvad.net | | | | | | |
| adblock.dns.mullvad.net | ✅ | ✅ | | | | |
| base.dns.mullvad.net | ✅ | ✅ | ✅ | | | |
| extended.dns.mullvad.net | ✅ | ✅ | ✅ | | | ✅ |
| family.dns.mullvad.net | ✅ | ✅ | ✅ | ✅ | ✅ | |
| all.dns.mullvad.net | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Endereços IP e portas

A tabela abaixo mostra os endereços IP que você precisa configurar em alguns resolvedores DNS.

| Nome de host | Endereço IPv4 | Endereço IPv6 | Porta DoH | Porta DoT |
|---|---|---|---|---|
| dns.mullvad.net | 194.242.2.2 | 2a07:e340::2 | 443 | 853 |
| adblock.dns.mullvad.net | 194.242.2.3 | 2a07:e340::3 | 443 | 853 |
| base.dns.mullvad.net | 194.242.2.4 | 2a07:e340::4 | 443 | 853 |
| extended.dns.mullvad.net | 194.242.2.5 | 2a07:e340::5 | 443 | 853 |
| family.dns.mullvad.net | 194.242.2.6 | 2a07:e340::6 | 443 | 853 |
| all.dns.mullvad.net | 194.242.2.9 | 2a07:e340::9 | 443 | 853 |
  
Esses IPs só podem ser usados com resolvedores DNS que suportam DoH ou DoT, não com DNS sobre UDP/53 ou TCP/53.

## Como usar este serviço

### Navegadores da web

Abaixo você pode encontrar instruções de configuração para diferentes navegadores e sistemas operacionais.

#### Navegador Mullvad

O [Navegador Mullvad](https://mullvad.net/download/browser) usa o serviço DNS Mullvad (sem bloqueadores de conteúdo) por padrão. Recomendamos que você use nosso serviço DNS criptografado apenas quando não estiver conectado à VPN Mullvad. Quando você está conectado à VPN Mullvad, as consultas DNS serão enviadas através do túnel VPN criptografado para o servidor DNS no servidor VPN Mullvad ao qual você está conectado, e isso é mais rápido.

**Desativando o DNS over HTTPS (ao usar a VPN Mullvad)**

1. Clique no botão de menu no canto superior direito e selecione **Configurações**.
2. Clique em **Privacidade e Segurança** na coluna esquerda.
3. Role até o final.
4. Em **Ativar DNS seguro usando**, selecione **Desativado**.

**Ativando o DNS over HTTPS (quando não estiver usando a VPN Mullvad)**

As duas primeiras opções de DNS acima estão incluídas nas configurações do navegador. Para mudar para uma das outras opções, siga estas instruções:

1. Clique no botão de menu no canto superior direito e selecione **Configurações**.
2. Clique em **Privacidade e Segurança** na coluna esquerda.
3. Role até o final.
4. Em **Ativar DNS seguro usando**, selecione **Proteção Máxima**.
5. Em **Escolher provedor**, clique na lista suspensa e selecione **Personalizado**.
6. No campo de texto que aparece, cole uma das seguintes opções e pressione **Enter** no teclado para defini-la.

- https://dns.mullvad.net/dns-query
- https://adblock.dns.mullvad.net/dns-query
- https://base.dns.mullvad.net/dns-query
- https://extended.dns.mullvad.net/dns-query
- https://family.dns.mullvad.net/dns-query
- https://all.dns.mullvad.net/dns-query

#### Firefox (versão desktop)

1. Clique no botão de menu no canto superior direito e selecione **Configurações**.
2. Clique em **Privacidade e Segurança** na coluna esquerda.
3. Role até o final.
4. Em **Ativar DNS seguro usando**, selecione **Proteção Máxima**.
5. Em **Escolher provedor**, clique na lista suspensa e selecione **Personalizado**.
6. No campo de texto que aparece, cole uma das seguintes opções e pressione **Enter** no teclado para defini-la.

- https://dns.mullvad.net/dns-query
- https://adblock.dns.mullvad.net/dns-query
- https://base.dns.mullvad.net/dns-query
- https://extended.dns.mullvad.net/dns-query
- https://family.dns.mullvad.net/dns-query
- https://all.dns.mullvad.net/dns-query

#### Chrome / Brave / Edge

1. Abra as **Configurações**.
2. Clique em **Privacidade e segurança** (no Chrome, Brave) ou **Privacidade, pesquisa e serviços** (no Edge).
3. Clique em **Segurança** (no Chrome, Brave).
4. Ative **Usar DNS seguro**.
5. Selecione Com: **Personalizado** (no Chrome, Brave) ou **Escolher um provedor de serviços** (no Edge).
6. Digite uma das seguintes opções e pressione Tab no teclado:

- https://dns.mullvad.net/dns-query
- https://adblock.dns.mullvad.net/dns-query
- https://base.dns.mullvad.net/dns-query
- https://extended.dns.mullvad.net/dns-query
- https://family.dns.mullvad.net/dns-query
- https://all.dns.mullvad.net/dns-query

7. Se disser "Verifique se este é um provedor válido ou tente novamente mais tarde", aguarde um momento.

### Sistemas operacionais de dispositivos móveis

#### Android 9 e posteriores

Siga estas etapas para usar o DNS over TLS:

1. Abra o aplicativo **Configurações** do Android.
2. Toque em **Rede e internet**.
3. Toque em **DNS privado**.
4. Selecione **Nome do host do provedor de DNS privado**.
5. Na linha de entrada, digite um destes:

- dns.mullvad.net
- adblock.dns.mullvad.net
- base.dns.mullvad.net
- extended.dns.mullvad.net
- family.dns.mullvad.net
- all.dns.mullvad.net

6. Toque em **Salvar**.

Se o Android não conseguir se conectar ao DNS, provavelmente o servidor DNS para o qual você está sendo roteado está muito longe e a latência é proibitiva. Neste caso, não funcionará.

#### iOS / iPadOS

Fornecemos perfis de configuração DNS para dispositivos Apple.

Nota: Se você ativou o iCloud Private Relay, as consultas DNS podem ir para servidores DNS fornecidos pela Apple, mesmo se você usar nosso perfil DNS.

1. Abra o Safari e acesse nosso [repositório GitHub.](https://github.com/mullvad/encrypted-dns-profiles)
2. Toque em, por exemplo, **base**.
3. Os perfis estão disponíveis em duas versões (DoH e DoT). Toque em qualquer uma delas.
4. Toque em **View raw**.
5. Toque em **Permitir** para baixar o perfil.
6. Toque em **Fechar**.
7. Se estiver usando iOS/iPadOS 18: Abra o aplicativo **Arquivos** e toque no perfil baixado.
8. Abra o aplicativo **Configurações**.
9. Role até o topo e toque em **Perfil Baixado**.
10. Toque em **Instalar**.
11. Digite a senha do seu iPhone/iPad.
12. Toque em **Instalar**.
13. Toque em **Instalar**.
14. Toque em **Concluído**.

Você pode visualizar, alterar e remover perfis de configuração instalados no aplicativo **Configurações** em **Geral** > **VPN e Gerenciamento de Dispositivos** > **DNS**.

### Sistemas operacionais desktop

#### Windows 11

Nota: Isso não está disponível no Windows 10 e algumas VMs podem não conseguir usá-lo.

1. Abra o aplicativo **Configurações**.
2. Clique em **Rede e internet** no lado esquerdo.
3. Clique em **Wi-Fi** ou **Ethernet**, dependendo de qual você usa. Você pode identificar pelo ícone no topo que diz "🌐 Conectado".
4. Se você clicou em Wi-Fi, clique em **Propriedades de hardware** e continue para o próximo passo. Se você clicou em Ethernet, apenas continue para o próximo passo.
5. Clique no botão **Editar** ao lado de **Atribuição de servidor DNS**.
6. Selecione **Manual** na lista suspensa.
7. Ative **IPv4**.
8. No campo **DNS preferencial**, insira o **endereço IP** para a opção DNS que você deseja usar, por exemplo, **194.242.2.4**.

- 194.242.2.2 - https://dns.mullvad.net/dns-query
- 194.242.2.3 - https://adblock.dns.mullvad.net/dns-query
- 194.242.2.4 - https://base.dns.mullvad.net/dns-query
- 194.242.2.5 - https://extended.dns.mullvad.net/dns-query
- 194.242.2.6 - https://family.dns.mullvad.net/dns-query
- 194.242.2.9 - https://all.dns.mullvad.net/dns-query

9. Em **DNS over HTTPS**, selecione **Ativado (modelo manual)** na lista suspensa.
10. Em **Modelo DNS over HTTPS**, insira o endereço ao lado do IP que você selecionou antes, por exemplo, **https://base.dns.mullvad.net/dns-query**.
11. Clique em **Salvar**.
12. Verifique nos detalhes da rede na mesma janela se você recebe um **endereço IPv6** do seu provedor de Internet. Nesse caso, clique no botão **Editar** ao lado de **Atribuição de servidor DNS** novamente.
13. Role até o final e ative **IPv6**.
14. Role para baixo novamente e no campo **DNS preferencial**, insira o **endereço IPv6** para a opção DNS que você deseja usar, por exemplo, **2a07:e340::4**.

- 2a07:e340::2 - https://dns.mullvad.net/dns-query
- 2a07:e340::3 - https://adblock.dns.mullvad.net/dns-query
- 2a07:e340::4 - https://base.dns.mullvad.net/dns-query
- 2a07:e340::5 - https://extended.dns.mullvad.net/dns-query
- 2a07:e340::6 - https://family.dns.mullvad.net/dns-query
- 2a07:e340::9 - https://all.dns.mullvad.net/dns-query

15. Em **DNS over HTTPS**, selecione **Ativado (modelo manual)** na lista suspensa.
16. Em **Modelo DNS over HTTPS**, insira o endereço ao lado do IP que você selecionou, por exemplo, **https://base.dns.mullvad.net/dns-query**.
17. Clique em **Salvar**.
18. Se você às vezes usa Wi-Fi e às vezes usa Ethernet, volte ao passo 1 e adicione as mesmas configurações para a outra rede. Caso contrário, certifique-se de que a outra rede esteja completamente desconectada para evitar que o Windows use o DNS dela.

#### macOS


Isso se aplica ao macOS 13 Ventura e mais recentes. Para versões mais antigas, consulte o [Guia do Usuário](https://support.apple.com/guide/mac-help/configuration-profiles-standardize-settings-mh35561/mac) do macOS.


1. Abra o Safari e acesse nosso [repositório GitHub.](https://github.com/mullvad/encrypted-dns-profiles)
2. Clique em, por exemplo, **base**.
3. Os perfis estão disponíveis em duas versões (DoH e DoT). Clique em qualquer uma delas.
4. Clique em **View raw**.
5. Clique em **Permitir** para baixar o perfil.
6. Abra o aplicativo **Configurações do Sistema**.
7. Na coluna esquerda, clique em **Privacidade e Segurança**.
8. No lado direito, role até o final e clique em **Perfis**.
9. Clique duas vezes no perfil Mullvad Encrypted DNS que você baixou.
10. No canto inferior esquerdo, clique em **Instalar...**
11. Digite sua senha de login do macOS e clique em **OK**.
  
Você pode visualizar e remover perfis de configuração instalados no aplicativo **Configurações do Sistema** em **Privacidade e Segurança** > **Perfis**.

No macOS 14 Sonoma, você pode selecionar perfis DNS nas Configurações do Sistema em **Rede > VPN e Filtros** na seção **Filtros e Proxies**. Em versões anteriores do macOS, é recomendável instalar apenas um perfil, pois ter vários perfis não funciona bem.  

Certifique-se de desativar o DNS seguro em seu navegador.
  

Chrome / Brave / Edge:

O perfil DNS funciona imediatamente no Safari e Firefox, no entanto, se você estiver usando navegadores baseados em Chromium, como Chrome, Brave ou Edge, eles não usarão o perfil DNS, a menos que você desative o cliente DNS interno do navegador. Abra o Terminal e execute os seguintes comandos:  

defaults write com.google.Chrome BuiltInDnsClientEnabled -bool false

defaults write com.brave.Browser BuiltInDnsClientEnabled -bool false

defaults write com.microsoft.Edge BuiltInDnsClientEnabled -bool false

#### Linux (Ubuntu e Fedora)

Estas instruções usam [systemd-resolved](https://wiki.archlinux.org/title/Systemd-resolved).

1. Abra um Terminal.
2. Certifique-se de que o systemd-resolved esteja habilitado executando este comando:
`sudo systemctl enable systemd-resolved`
3. Abra o aplicativo Configurações e vá para Rede. Clique no ícone de configurações da sua rede conectada. Nas guias **IPv4** e **IPv6**, desative Automático usando o botão de opção ao lado de **DNS** e deixe o campo DNS em branco, depois clique em **Aplicar**. Desative e ative a rede usando o botão liga/desliga para garantir que tenha efeito.
4. Edite o seguinte arquivo com **nano** ou seu editor de texto favorito:

Fedora: `sudo nano /usr/lib/systemd/resolved.conf`

Ubuntu: `sudo nano /etc/systemd/resolved.conf`

Adicione as seguintes linhas na parte inferior, sob [Resolve]. Remova um **#** do início de uma linha com a opção DNS que você deseja usar:

#DNS=194.242.2.2#dns.mullvad.net
#DNS=194.242.2.3#adblock.dns.mullvad.net
#DNS=194.242.2.4#base.dns.mullvad.net
#DNS=194.242.2.5#extended.dns.mullvad.net
#DNS=194.242.2.6#family.dns.mullvad.net
#DNS=194.242.2.9#all.dns.mullvad.net
DNSSEC=no
DNSOverTLS=yes
Domains=~.

5. Salve o arquivo pressionando Ctrl + O e depois Enter, e depois Ctrl + X no teclado.
6. Crie um link simbólico para o arquivo usando o seguinte comando no Terminal:

`sudo ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf`

7. Reinicie o systemd-resolved executando este comando:

`sudo systemctl restart systemd-resolved`

8. Reinicie o NetworkManager com este comando:

`sudo systemctl restart NetworkManager`

9. Verifique as configurações de DNS com:

`resolvectl status`

Caso não funcione, mude para esta configuração em /etc/systemd/resolved.conf:

DNSOverTLS=opportunistic

Observe que você pode ativar o DNSSEC se quiser, no entanto, alguns sites com informações incorretas de DNSSEC não poderão carregar e o navegador da web não informará o motivo.

## Como saber se está funcionando?

Depois de seguir as instruções acima, acesse [https://mullvad.net/check](https://mullvad.net/check). Você não deve ter vazamentos de DNS. Clique em "Sem vazamentos de DNS" para detalhes; o servidor listado deve ter "dns" em seu nome, por exemplo "se-mma-**dns**-001.mullvad.net".

## Localizações dos servidores DNS

Usamos roteamento anycast, o que significa que idealmente o servidor DNS mais próximo deve ser usado. Se um servidor estiver inoperante, o próximo mais próximo deve ser usado e assim por diante. Tenha em mente que o mais próximo está em termos de saltos de rede, isso pode diferir entre seu ISP e sua conectividade com nossos provedores de hospedagem. Você pode verificar qual servidor DNS está usando expandindo a caixa DNS em nossa [Verificação de Conexão](https://mullvad.net/check).

### Usando um servidor DNS específico

Se você não precisa de nenhum bloqueador de conteúdo DNS, apenas um DNS não filtrado, pode usar um dos nomes de servidor abaixo.

| Servidor | País | Cidade |
|---|---|---|
| https://de-fra-dns-001.mullvad.net/dns-query | Alemanha | Frankfurt |
| https://gb-lon-dns-001.mullvad.net/dns-query | Reino Unido | Londres |
| https://gb-lon-dns-301.mullvad.net/dns-query | Reino Unido | Londres |
| https://se-got-dns-001.mullvad.net/dns-query | Suécia | Gotemburgo |
| https://se-mma-dns-001.mullvad.net/dns-query | Suécia | Malmö |
| https://se-sto-dns-001.mullvad.net/dns-query | Suécia | Estocolmo |
| https://sg-sin-dns-101.mullvad.net/dns-query | Singapura | Singapura |
| https://us-dal-dns-001.mullvad.net/dns-query | EUA | Dallas |
| ~~https://us-lax-dns-401.mullvad.net/dns-query~~ | ~~EUA~~ | ~~Los Angeles~~ |
| https://us-nyc-dns-601.mullvad.net/dns-query | EUA | Nova York |
  
## Como funciona o bloqueio de conteúdo

A Mullvad mantém uma coleção de listas "temáticas" cujo conteúdo é obtido de listas de bloqueio disponíveis publicamente.

Quando o cliente consulta um nome de host que corresponde a um item na lista de bloqueio, nosso resolvedor simplesmente mente para o cliente e diz que o nome de host não existe.

Isso significa que qualquer conteúdo que o navegador tentou carregar não é carregado e, portanto, não é mostrado na tela.

Para mais informações sobre quais domínios são bloqueados por quais listas e quais listas da comunidade compõem as listas curadas da Mullvad, consulte nosso [GitHub](https://github.com/mullvad/dns-blocklists).

O bloqueio de conteúdo DNS não pode bloquear todos os anúncios e rastreadores. Por exemplo, não pode bloquear anúncios do YouTube. Para bloquear mais anúncios e rastreadores em seu navegador da web, recomendamos o uso da extensão [uBlock Origin](https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/). Isso está incluído no [Navegador Mullvad](https://mullvad.net/download/browser/).

## Notas

Versões anteriores deste guia continham referências a doh.mullvad.net e dot.mullvad.net. Esses nomes de host foram substituídos pelo nome de host comum dns.mullvad.net e estão sujeitos a descontinuação futura. Recomendamos a todos os usuários que usem os novos nomes de host que incluem dns.mullvad.net.

Os seguintes IPs não são mais usados: 193.19.108.2 e 193.19.108.3.

#### Proxy SOCKS5

Se você ativar o uso do nosso [proxy SOCKS5](https://mullvad.net/help/socks5-proxy/) no Firefox e ativar a configuração **Proxy DNS ao usar SOCKS v5**, as consultas DNS não usarão o serviço DNS criptografado público e os bloqueadores de conteúdo DNS não funcionarão. Nosso proxy SOCKS5 só funciona quando você está conectado à Mullvad, e recomendamos que você não use o serviço DNS público quando estiver conectado à Mullvad, pelos motivos [indicados acima](#como-usar-este-serviço). Em vez disso, você pode ativar os [bloqueadores de conteúdo DNS](https://mullvad.net/help/using-mullvad-vpn-on-android/#dns-blockers) nas configurações do aplicativo Mullvad.