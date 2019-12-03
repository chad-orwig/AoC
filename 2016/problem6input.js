const testInput = "eedadn\n" +
    "drvtee\n" +
    "eandsr\n" +
    "raavrd\n" +
    "atevrs\n" +
    "tsrnev\n" +
    "sdttsa\n" +
    "rasrtv\n" +
    "nssdts\n" +
    "ntnada\n" +
    "svetve\n" +
    "tesnvt\n" +
    "vntsnd\n" +
    "vrdear\n" +
    "dvrsen\n" +
    "enarar";

const testInputSplit = testInput.split('\n');

const input = "iyeajeby\n" +
    "qengiuoe\n" +
    "wxzardgo\n" +
    "jciguemn\n" +
    "zcampkps\n" +
    "kiqjpjqb\n" +
    "knwhoxlw\n" +
    "iaxxpjhe\n" +
    "kgrgaixi\n" +
    "lciydajs\n" +
    "svugtdwe\n" +
    "nwailbqu\n" +
    "cbkwwxvt\n" +
    "lqjyrawh\n" +
    "jylmtlzk\n" +
    "firecpyg\n" +
    "xegtcvvx\n" +
    "jllqqzeq\n" +
    "hggmnxlc\n" +
    "pdmfuqlx\n" +
    "hnbksbkl\n" +
    "pmjmiqti\n" +
    "gpmuvcsh\n" +
    "tspnxvnm\n" +
    "hghwizhe\n" +
    "sgokeybb\n" +
    "jtphckcv\n" +
    "usypmmzq\n" +
    "irlfaboj\n" +
    "prgiqvil\n" +
    "nfqegpjd\n" +
    "aivwwkix\n" +
    "xeljyzjv\n" +
    "mrdpqlzc\n" +
    "metcvpvd\n" +
    "ifizfkgl\n" +
    "uznvqiqw\n" +
    "uzylkeui\n" +
    "obmqhlan\n" +
    "vaoivkeq\n" +
    "wvlbwfaf\n" +
    "ntbgtbpz\n" +
    "lbuieiea\n" +
    "rljyfeop\n" +
    "rynkdwiq\n" +
    "hyqpjwzl\n" +
    "supxlsql\n" +
    "bntmjboc\n" +
    "qntfhain\n" +
    "xxtjctjz\n" +
    "qppakrbj\n" +
    "ptnnwmlg\n" +
    "pucuqrpi\n" +
    "ensluhxm\n" +
    "wtnabsej\n" +
    "hvnozkvx\n" +
    "dhxgysdk\n" +
    "qdizyrkg\n" +
    "vtuyxjky\n" +
    "lxwcyfxr\n" +
    "xoyphxmb\n" +
    "ltylucct\n" +
    "oaawvjfa\n" +
    "qbjmdcap\n" +
    "raqhkkbe\n" +
    "uqtxpvhj\n" +
    "pddzoucq\n" +
    "axfbgpvj\n" +
    "eohksqcm\n" +
    "jtmmkovb\n" +
    "paronxgv\n" +
    "gtxnqybz\n" +
    "qfsobvxz\n" +
    "ywrnogwz\n" +
    "ytdvpmzv\n" +
    "daeappko\n" +
    "zgjdatzf\n" +
    "psrfofvi\n" +
    "uobknckb\n" +
    "rvndwdgs\n" +
    "oedojfqv\n" +
    "shxmutcm\n" +
    "nigdxgrz\n" +
    "ngwvdair\n" +
    "wexxkvwn\n" +
    "oqmrjlcr\n" +
    "vcbmxvyb\n" +
    "ekdfdzch\n" +
    "klphcryl\n" +
    "bbtobqqo\n" +
    "wupuvqio\n" +
    "hwiufjpk\n" +
    "rckjewzp\n" +
    "vhgzdtil\n" +
    "qrvqytfe\n" +
    "opolrgwi\n" +
    "nektqhbg\n" +
    "ynubobwy\n" +
    "cqnysvzf\n" +
    "muqrlihy\n" +
    "ncbeeuur\n" +
    "hxsvpoug\n" +
    "kacsofnk\n" +
    "vztkoicu\n" +
    "smxiuykn\n" +
    "sgnmdqmw\n" +
    "sfsxxnds\n" +
    "iwquujxr\n" +
    "fwssfvfw\n" +
    "qyoswzsm\n" +
    "kvfvizgu\n" +
    "fmewmudq\n" +
    "mvtekgjn\n" +
    "kkffshrt\n" +
    "jzbkyxzf\n" +
    "beszoylz\n" +
    "lnhmbwae\n" +
    "tijfkcrt\n" +
    "culovluh\n" +
    "jrgtbxma\n" +
    "yqtlarnm\n" +
    "rdlxlplt\n" +
    "vzgphnpi\n" +
    "igpbfrrd\n" +
    "yqdgvyke\n" +
    "juhzerjo\n" +
    "kfwlvhag\n" +
    "ysznuuey\n" +
    "turxgyik\n" +
    "iqgcxxpa\n" +
    "tjrmtkjk\n" +
    "ywfcwvqp\n" +
    "ozmguljj\n" +
    "maxegnqi\n" +
    "vavydxwd\n" +
    "dhlckjra\n" +
    "omvdoafe\n" +
    "rvzejiol\n" +
    "rsnpjser\n" +
    "nejognkt\n" +
    "agkavzki\n" +
    "uzskztny\n" +
    "knvzbkff\n" +
    "iiuhrzsp\n" +
    "amxryjhv\n" +
    "yqxdgdaj\n" +
    "tpvellfc\n" +
    "dqutbibf\n" +
    "fbbrpcbg\n" +
    "shxlcvmc\n" +
    "ociooedg\n" +
    "nedlhmfo\n" +
    "ohdxifnx\n" +
    "mqhbpyed\n" +
    "tauomzjy\n" +
    "bkooiesi\n" +
    "xtukgdec\n" +
    "mygazipf\n" +
    "wkvecylo\n" +
    "tlejwzcj\n" +
    "rcpygkbi\n" +
    "uihidqdr\n" +
    "lxwthely\n" +
    "ywyoahob\n" +
    "zwjrveex\n" +
    "eqahofbx\n" +
    "mvipdaql\n" +
    "zccdioga\n" +
    "gttnacns\n" +
    "urajevul\n" +
    "uhsdjkhm\n" +
    "cjbpznua\n" +
    "tyfvodhw\n" +
    "feadmwyl\n" +
    "cjmccfcy\n" +
    "uawxsuyy\n" +
    "xzzidfrj\n" +
    "slhgapvb\n" +
    "tbdwntwx\n" +
    "bvspfozq\n" +
    "pkkwgooy\n" +
    "frnhifax\n" +
    "sxfkbojn\n" +
    "ffnzlqda\n" +
    "pbtbewtm\n" +
    "mivpqcyc\n" +
    "gztezasy\n" +
    "jlfdrmou\n" +
    "xjmazeef\n" +
    "lgcaevtl\n" +
    "piidoxbi\n" +
    "iczlosyt\n" +
    "egszahwu\n" +
    "cmbybzvi\n" +
    "orczduhd\n" +
    "hzorfhdv\n" +
    "yptggtmu\n" +
    "yfsmednv\n" +
    "ajawzgpp\n" +
    "niicgavl\n" +
    "mmdpsogr\n" +
    "wkufsuct\n" +
    "yboinvnc\n" +
    "lmwbrqmb\n" +
    "rrsfhics\n" +
    "xguvmcmi\n" +
    "yldifule\n" +
    "laycxgaf\n" +
    "jtnizmxf\n" +
    "qrbpqznc\n" +
    "cpplgbsm\n" +
    "xzkwttnj\n" +
    "axjxusuh\n" +
    "nthcjcqn\n" +
    "zjkdjlcz\n" +
    "uulqjmfq\n" +
    "djqlzrcb\n" +
    "ftxhzuoq\n" +
    "bfrzrdtn\n" +
    "fvovpzts\n" +
    "tloyyqoa\n" +
    "spupkgwb\n" +
    "ishhbwok\n" +
    "spyfzbsj\n" +
    "bvvnfnxx\n" +
    "iuectyxc\n" +
    "xbbjridq\n" +
    "drzfvsrw\n" +
    "gokuvwjf\n" +
    "hhkmgqxf\n" +
    "epijynaj\n" +
    "bfxdnibq\n" +
    "pjoovmhf\n" +
    "izbgldjr\n" +
    "rvxrhjxa\n" +
    "blhhorwy\n" +
    "xwmobyph\n" +
    "pfoimsbl\n" +
    "gprwonid\n" +
    "hfwmazfu\n" +
    "dudhehvt\n" +
    "nbekhgbg\n" +
    "qbwklpvg\n" +
    "yemjyobm\n" +
    "vmocaztb\n" +
    "xkwklord\n" +
    "tjooucsf\n" +
    "qowresxh\n" +
    "cxeapuvv\n" +
    "zmlzqivx\n" +
    "fryanflf\n" +
    "kxcrserx\n" +
    "jtoqtooo\n" +
    "axrtkjyo\n" +
    "fwwzdsbx\n" +
    "pyphszfp\n" +
    "ekdcnrgx\n" +
    "zyrhxcvc\n" +
    "blcqplmo\n" +
    "wnsiistm\n" +
    "slavtfip\n" +
    "sixawglm\n" +
    "sxpjnpsa\n" +
    "sfwmudzt\n" +
    "kcpetkcw\n" +
    "iqfufsws\n" +
    "wdfbgvol\n" +
    "muvtnxzg\n" +
    "otgycshn\n" +
    "gddbabma\n" +
    "swksjxjx\n" +
    "hnfcsnir\n" +
    "tmcnycfi\n" +
    "lpvuwehn\n" +
    "htyogany\n" +
    "rggezmhh\n" +
    "guzhwmss\n" +
    "zoqiscdy\n" +
    "dqbtvyrb\n" +
    "wfnymsai\n" +
    "klfpdgvn\n" +
    "ihqjdope\n" +
    "dudllmty\n" +
    "gpbkmwtd\n" +
    "tjmtvjpk\n" +
    "sjnkfrsk\n" +
    "bgruelqs\n" +
    "repdjhre\n" +
    "flxjlvah\n" +
    "lkpnbajp\n" +
    "rmkqdjpx\n" +
    "enimddcn\n" +
    "nzowveei\n" +
    "cohzzkee\n" +
    "sxfvyqwi\n" +
    "vlztaixp\n" +
    "xgkrlsyh\n" +
    "eaurshic\n" +
    "kifvzhsv\n" +
    "dxfsexup\n" +
    "fyqqbzgm\n" +
    "bnxsgjxg\n" +
    "ndbbkscp\n" +
    "xyjhzqel\n" +
    "eyanetmo\n" +
    "quakpmsr\n" +
    "kqfeprrb\n" +
    "hhsvwyse\n" +
    "jjvjivng\n" +
    "zkeiinwn\n" +
    "adibxest\n" +
    "zjzrkmxr\n" +
    "kceozeud\n" +
    "iknfusda\n" +
    "gqmuepbo\n" +
    "ccwltods\n" +
    "smaurfwy\n" +
    "yojrrudk\n" +
    "akygvwyf\n" +
    "dermnpvn\n" +
    "bvfvjskb\n" +
    "pcohqoyu\n" +
    "odyqfyhy\n" +
    "nqgepwqo\n" +
    "zijtbqgd\n" +
    "czfgqsmr\n" +
    "fkgeoorf\n" +
    "udvncboo\n" +
    "dwxgrgck\n" +
    "vqhthccp\n" +
    "gvkfkpwr\n" +
    "pquhsiha\n" +
    "hlpqfrpz\n" +
    "aeirprab\n" +
    "bouoglph\n" +
    "zwyimnhu\n" +
    "zpculwdn\n" +
    "mokpnpeq\n" +
    "hfgfjamc\n" +
    "osgncdnf\n" +
    "ejfjqwql\n" +
    "tovcchzu\n" +
    "wwmburym\n" +
    "mdonvwnw\n" +
    "wxjysrlt\n" +
    "cjrqrnqv\n" +
    "okzeilge\n" +
    "egunoujn\n" +
    "dlbaqemd\n" +
    "qrdyabya\n" +
    "vaaxguwe\n" +
    "hjqwytxz\n" +
    "xtvmgdaq\n" +
    "noijjgft\n" +
    "xgysigmw\n" +
    "urbsmwdk\n" +
    "bjnerghw\n" +
    "aspvghjp\n" +
    "hgciumho\n" +
    "ivjihqed\n" +
    "wtvkobuw\n" +
    "zhtyhllg\n" +
    "jlxjwjui\n" +
    "xkmxhoek\n" +
    "rydzmqip\n" +
    "ydonbzvk\n" +
    "byeoptyo\n" +
    "gpnnqxrb\n" +
    "hyzplaie\n" +
    "tbedyaph\n" +
    "zgqhqnmg\n" +
    "tdepvaex\n" +
    "wytwmgkr\n" +
    "qsmuyzys\n" +
    "fijlauqj\n" +
    "wyqylgam\n" +
    "lbwxnluj\n" +
    "nmecxavu\n" +
    "ofktnhfb\n" +
    "lhjgzkjr\n" +
    "ucctfetk\n" +
    "mggvgkmu\n" +
    "yzmnbbhe\n" +
    "kcnqhuam\n" +
    "rxiwfblx\n" +
    "vfufzjou\n" +
    "cpynrovg\n" +
    "qdwshnpi\n" +
    "pcrxywto\n" +
    "ozhzwpwa\n" +
    "zroxmvfr\n" +
    "fpipfjvu\n" +
    "leyiafxs\n" +
    "oacgxszs\n" +
    "voebeyvn\n" +
    "ixkqabkl\n" +
    "lqabfhtd\n" +
    "oewbtlgc\n" +
    "vdlaniii\n" +
    "tabtkolp\n" +
    "xufkdmem\n" +
    "niofeqxn\n" +
    "innfbedm\n" +
    "zahlnzhd\n" +
    "whmqyffv\n" +
    "fhjascxd\n" +
    "wnsktsdi\n" +
    "ucdgnvkf\n" +
    "fmpxuyml\n" +
    "pnvuhmup\n" +
    "wohfuyto\n" +
    "wthjmlzx\n" +
    "tkcdmttv\n" +
    "ubyrests\n" +
    "mkrplnes\n" +
    "mglepvyl\n" +
    "shqafjly\n" +
    "gbpaitlu\n" +
    "cesjmugk\n" +
    "qnqmvnks\n" +
    "kbvvlltq\n" +
    "luvgtdmv\n" +
    "rrrhawdz\n" +
    "dthrxkth\n" +
    "bglwrdgk\n" +
    "apqxickb\n" +
    "vnzwzjba\n" +
    "reiafjdt\n" +
    "qfcunhks\n" +
    "dwmhshtd\n" +
    "rwtwnxxu\n" +
    "gjgdhwtr\n" +
    "dhrwidzp\n" +
    "manohccv\n" +
    "jvccmlat\n" +
    "txhfklix\n" +
    "nczocnew\n" +
    "gxlpkgqr\n" +
    "vsrtxogh\n" +
    "ixhtcwaz\n" +
    "qfapctcq\n" +
    "glvtpiug\n" +
    "jnuecngg\n" +
    "bktbndyg\n" +
    "ceboexzj\n" +
    "lsjakjjw\n" +
    "oemmiqvu\n" +
    "zqscwlay\n" +
    "hqedlpzb\n" +
    "hsrztfxj\n" +
    "fjpwidgw\n" +
    "abrsenrv\n" +
    "qseoiuyj\n" +
    "jtjtqxgr\n" +
    "esczykzc\n" +
    "mazmziim\n" +
    "szzwzfuq\n" +
    "zbcfhaiz\n" +
    "uqsnjwus\n" +
    "vwzqohsu\n" +
    "yylbjhnl\n" +
    "chqdcblk\n" +
    "vporypnv\n" +
    "vfhdofdx\n" +
    "eztmaogh\n" +
    "wlzjsgbw\n" +
    "dqutunrc\n" +
    "gwtpdvpm\n" +
    "ywxghnkc\n" +
    "alacomlw\n" +
    "jfuygdcy\n" +
    "zkoeauig\n" +
    "abufqquo\n" +
    "ncilvdgq\n" +
    "guinnabe\n" +
    "pdwybure\n" +
    "jocsrmfp\n" +
    "acwncthl\n" +
    "cdnaffnn\n" +
    "zyqbszzz\n" +
    "azhxybig\n" +
    "hibjuhsw\n" +
    "tvckjxuf\n" +
    "vklsqbos\n" +
    "efzukhlt\n" +
    "kjaqqofz\n" +
    "esxcyrxt\n" +
    "yocrwucn\n" +
    "iodafafm\n" +
    "oiakmvtb\n" +
    "dmbgtcpj\n" +
    "qnzrryot\n" +
    "ufcbptbz\n" +
    "veprgqre\n" +
    "umsltfes\n" +
    "bvvqhcmz\n" +
    "rucsowjt\n" +
    "kkbgkrxe\n" +
    "fksibbfh\n" +
    "tyckeiqo\n" +
    "gfqurpyl\n" +
    "raljmvsf\n" +
    "chednohc\n" +
    "gowzqrfm\n" +
    "ypktqcvb\n" +
    "fgiusizq\n" +
    "jvdsmnhu\n" +
    "esfuxpra\n" +
    "uraiwlfz\n" +
    "vpkulaao\n" +
    "erkvbjrj\n" +
    "mrhjjist\n" +
    "xmpayrdq\n" +
    "biqwpkrm\n" +
    "lrlhkljw\n" +
    "rbaglxsu\n" +
    "kryywepc\n" +
    "mrydxkuv\n" +
    "obksnkir\n" +
    "jogxscwa\n" +
    "pxkzdamo\n" +
    "wcywigdv\n" +
    "acqicmyz\n" +
    "xiqhgpik\n" +
    "izubxapc\n" +
    "yrzfptzd\n" +
    "qmyltgkw\n" +
    "dwedcarp\n" +
    "oouewlrv\n" +
    "izelyufn\n" +
    "ehdstcah\n" +
    "nylqvqtd\n" +
    "ywxjkxnx\n" +
    "sstceepq\n" +
    "bjihzptq\n" +
    "nvawrewu\n" +
    "plftxhsh\n" +
    "eyuzdika\n" +
    "gjdyaoek\n" +
    "euqeablj\n" +
    "zhgjzdki\n" +
    "lyygbhly\n" +
    "joscwikc\n" +
    "cbqczxbu\n" +
    "xnhptyqu\n" +
    "txvltmyh\n" +
    "kwtaueat\n" +
    "btpbbibj\n" +
    "ueytsouw\n" +
    "kfmmcyqk\n" +
    "fwflotzv\n" +
    "ouwyewua\n" +
    "hslsjpur\n" +
    "jdgrtwme\n" +
    "lgelctfc\n" +
    "nlxyvkgh\n" +
    "xpeslfje\n" +
    "adcifgwz\n" +
    "gquvwdeb\n" +
    "rkmzqard\n" +
    "lvzehstp\n" +
    "cijqaygt\n" +
    "dwfzsddm\n" +
    "vmwqrrsy\n" +
    "aotsaqoj\n" +
    "irjumknp\n" +
    "altzbfjo\n" +
    "hubsrgdb\n" +
    "nudnkfof\n" +
    "bvhvcltf\n" +
    "xupumtmg\n" +
    "kjfxunyd\n" +
    "pjwhyeuz\n" +
    "zmnxkepw\n" +
    "mpzvjjni\n" +
    "cskxvphp\n" +
    "dykbldmb\n" +
    "ymmsshaj\n" +
    "gdsvrycq\n" +
    "ehdvpiqy\n" +
    "engermzp\n" +
    "tmexxgkw\n" +
    "acjslpiv\n" +
    "qprqqyqf\n" +
    "fbictbjs\n" +
    "llaeirez\n" +
    "uxoofxnc\n" +
    "ukgpjtlz\n" +
    "tpxwxzpu\n" +
    "cuzgcjgd\n" +
    "jnzxfqww\n" +
    "wemyhsbv\n" +
    "aslnwaqg\n" +
    "aibaikgt\n" +
    "hglojgqv\n" +
    "larqrtka\n" +
    "ozlrwpna\n" +
    "pzxsdrjh\n" +
    "vsnuuusj\n" +
    "jswkkvun\n" +
    "darbbbhk\n" +
    "woeihkoh\n" +
    "xdsunolx\n" +
    "ymvbtrxg\n" +
    "mtodxqik\n" +
    "fxkcdfwq\n" +
    "koivubnr\n" +
    "gitldbqs\n" +
    "bsjymzpd\n" +
    "whaluyys\n" +
    "rvaftjox\n" +
    "qhinxcid\n" +
    "snpkwuko\n" +
    "mdgvstoq\n" +
    "zzytixxc\n" +
    "qsgrlmdn\n" +
    "ddjqxeaw\n" +
    "uilqxznh\n" +
    "chazpmyk\n" +
    "iivrixot\n" +
    "casfxwwa\n" +
    "mvjdazsr\n" +
    "dnmivmal\n" +
    "eayyeyfh";

const inputSplit = input.split('\n');

module.exports = {
    testInputSplit,
    inputSplit
};