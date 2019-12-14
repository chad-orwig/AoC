const input = `11 TLKRB, 9 DHRN, 1 XTLB => 5 TPXQR
1 GVWZR, 1 RVXMK => 5 BSKC
5 PQXHB, 1 WLMCM => 5 FDGBF
7 XVPB, 10 RMRPX, 2 XVQDV => 4 JFSDT
8 MCQK, 11 RMRPX => 7 STJNH
6 JFRPS => 3 ZRKZ
3 DNDTC, 1 SLPZ => 4 WQCSD
5 BSKC => 1 ZVBX
3 TQXFD, 24 FDGBF, 2 RMRPX => 6 MGHBF
7 JFSDT => 5 VHJM
5 XTLB, 3 DGDNX => 5 ZKDG
12 KHLSP, 1 JFSDT, 23 PBJMZ => 5 RMHKH
1 RMRPX => 9 DNDTC
2 CKRXP, 1 HKWV, 1 RBCPD => 3 ZLVG
11 SLPZ, 27 WQCSD, 2 STJNH => 4 RBCPD
1 TQXFD, 1 RVXMK => 5 LNWD
2 WCJM => 8 NMWV
1 PQXHB, 5 WLMCM => 5 XTLB
1 DHRN => 2 RVXMK
147 ORE => 4 XPFRX
4 KMHG, 11 LNWD => 4 MCQK
4 MGHBF => 3 JCVCG
2 ZRKZ, 1 JFRPS => 6 QTRJ
4 RMHKH => 5 HJNP
13 JPKGW, 20 STJNH, 32 JBPFQ, 9 GXSTP, 3 QRFRQ, 35 ZVBX, 4 HJNP, 54 DVRSL, 45 KZBW, 23 RVXMK => 1 FUEL
12 VFTDK, 29 QDTNQ => 4 XVPB
3 XVQDV => 8 MXWK
11 RVXMK, 12 PZNJ, 1 QXNK, 2 ZKDG, 4 DHWR, 4 WCJM, 7 VHJM, 2 HKWV => 5 QRFRQ
1 LNWD, 4 VHJM => 4 WCJM
6 NMWV, 6 MXWK, 15 DVRSL, 17 ZLVG, 5 JFSDT, 10 SGBQP, 1 GWDVS => 5 JBPFQ
3 TPXQR, 3 RVXMK => 5 XKSXK
6 TPXQR, 2 JCVCG, 1 KMHG => 3 DHWR
3 XTLB => 7 RMRPX
26 HKWV, 2 STJNH, 1 MXWK, 3 CPXW, 2 CKRXP, 16 QTRJ, 1 WQCSD => 8 GXSTP
5 TLKRB => 7 TQXFD
12 VHJM => 9 JPKGW
4 MGHBF, 17 XVPB => 3 KHLSP
1 DVRSL => 3 GWDVS
3 DHRN => 6 KZBW
13 QXNK, 3 SGSBS, 23 BSKC => 6 DVRSL
11 RBCPD => 5 CPXW
177 ORE => 6 VFTDK
1 XVQDV => 4 SLPZ
17 SGSBS, 1 GVWZR => 5 JFRPS
178 ORE => 1 WLMCM
7 DVRSL, 2 MXWK => 4 DGDNX
14 PZNJ, 5 JCVCG, 3 RBCPD => 8 SGBQP
1 QDTNQ, 2 JFRPS, 1 ZRKZ => 8 PBJMZ
4 LNWD => 1 QXNK
30 VFTDK => 8 DHRN
8 TPXQR, 6 XKSXK, 6 TLKRB => 6 KMHG
1 TQXFD, 3 QTRJ => 6 QDTNQ
123 ORE => 4 TLKRB
1 BSKC => 5 XVQDV
132 ORE => 4 PQXHB
5 TLKRB => 7 SGSBS
17 XPFRX => 6 GVWZR
4 HKWV => 5 CKRXP
1 RVXMK, 1 KHLSP => 8 PZNJ
1 JFSDT => 4 HKWV`;

const test1 = `9 ORE => 2 A
8 ORE => 3 B
7 ORE => 5 C
3 A, 4 B => 1 AB
5 B, 7 C => 1 BC
4 C, 1 A => 1 CA
2 AB, 3 BC, 4 CA => 1 FUEL`;

function readQtyAndChem(str) {
    const[qtyStr, chem] = str.split(' ');
    return {
        qty : Number(qtyStr),
        chem
    };
}

function readRecipie(str) {
    const[inStr, outStr] = str.split(' => ');
    const output = readQtyAndChem(outStr);
    const inputs = inStr.split(', ').map(readQtyAndChem);
    return {
        inputs,
        output
    };
}

const recipies = input.split('\n')
    .map(readRecipie);

module.exports = recipies;