### PV
PV（Page View）访问量, 即页面浏览量或点击量，衡量网站用户访问的网页数量；在一定统计周期内用户每打开或刷新一个页面就记录1次，多次打开或刷新同一页面则浏览量累计。 说白了就是统计一下某些页面在一段时间比如一天内被访问了多少次，哪怕是同一个用户访问多次也没关系，说不定这个用户就是特别钟爱这个页面呢？所以重复访问是计算为有效的
### UV
UV（Unique Visitor）独立访客，统计1天内访问某站点的用户数(以cookie为依据);访问网站的一台电脑客户端为一个访客。可以理解成访问某网站的电脑的数量。网站判断来访电脑的身份是通过来访电脑的cookies实现的。如果更换了IP后但不清除cookies，再访问相同网站，该网站的统计中UV数是不变的。如果用户不保存cookies访问、清除了cookies或者更换设备访问，计数会加1。00:00-24:00内相同的客户端多次访问只计为1个访客。 说白了就是根据用户登陆后所记录的cookie（来源可能是session或者token）来标识一个用户，以统计有多少用户访问应用。
### IP
IP（Internet Protocol）独立IP数，是指1天内多少个独立的IP浏览了页面，即统计不同的IP浏览用户数量。同一IP不管访问了几个页面，独立IP数均为1；不同的IP浏览页面，计数会加1。 IP是基于用户广域网IP地址来区分不同的访问者的，所以，多个用户（多个局域网IP）在同一个路由器（同一个广域网IP）内上网，可能被记录为一个独立IP访问者。如果用户不断更换IP，则有可能被多次统计。 说白了就是根据用户的IP来标识一个用户，以统计有多少用户访问应用。