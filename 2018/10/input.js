const testInput = "position=< 9,  1> velocity=< 0,  2>\n" +
    "position=< 7,  0> velocity=<-1,  0>\n" +
    "position=< 3, -2> velocity=<-1,  1>\n" +
    "position=< 6, 10> velocity=<-2, -1>\n" +
    "position=< 2, -4> velocity=< 2,  2>\n" +
    "position=<-6, 10> velocity=< 2, -2>\n" +
    "position=< 1,  8> velocity=< 1, -1>\n" +
    "position=< 1,  7> velocity=< 1,  0>\n" +
    "position=<-3, 11> velocity=< 1, -2>\n" +
    "position=< 7,  6> velocity=<-1, -1>\n" +
    "position=<-2,  3> velocity=< 1,  0>\n" +
    "position=<-4,  3> velocity=< 2,  0>\n" +
    "position=<10, -3> velocity=<-1,  1>\n" +
    "position=< 5, 11> velocity=< 1, -2>\n" +
    "position=< 4,  7> velocity=< 0, -1>\n" +
    "position=< 8, -2> velocity=< 0,  1>\n" +
    "position=<15,  0> velocity=<-2,  0>\n" +
    "position=< 1,  6> velocity=< 1,  0>\n" +
    "position=< 8,  9> velocity=< 0, -1>\n" +
    "position=< 3,  3> velocity=<-1,  1>\n" +
    "position=< 0,  5> velocity=< 0, -1>\n" +
    "position=<-2,  2> velocity=< 2,  0>\n" +
    "position=< 5, -2> velocity=< 1,  2>\n" +
    "position=< 1,  4> velocity=< 2,  1>\n" +
    "position=<-2,  7> velocity=< 2, -2>\n" +
    "position=< 3,  6> velocity=<-1, -1>\n" +
    "position=< 5,  0> velocity=< 1,  0>\n" +
    "position=<-6,  0> velocity=< 2,  0>\n" +
    "position=< 5,  9> velocity=< 1, -2>\n" +
    "position=<14,  7> velocity=<-2,  0>\n" +
    "position=<-3,  6> velocity=< 2, -1>";

const input = "position=< 21188,  31669> velocity=<-2, -3>\n" +
    "position=<-10416, -31455> velocity=< 1,  3>\n" +
    "position=< 21144, -31450> velocity=<-2,  3>\n" +
    "position=< 42218,  21146> velocity=<-4, -2>\n" +
    "position=< 42223,  10633> velocity=<-4, -1>\n" +
    "position=<-52484,  42188> velocity=< 5, -4>\n" +
    "position=< 52759,  21154> velocity=<-5, -2>\n" +
    "position=<-41981,  21153> velocity=< 4, -2>\n" +
    "position=<-10386, -31452> velocity=< 1,  3>\n" +
    "position=< 10651, -10414> velocity=<-1,  1>\n" +
    "position=< 42234,  42197> velocity=<-4, -4>\n" +
    "position=<-52447,  42193> velocity=< 5, -4>\n" +
    "position=< 52763, -10408> velocity=<-5,  1>\n" +
    "position=< 31673,  21150> velocity=<-3, -2>\n" +
    "position=< 10660, -52501> velocity=<-1,  5>\n" +
    "position=<-31433, -31453> velocity=< 3,  3>\n" +
    "position=< 52750, -20933> velocity=<-5,  2>\n" +
    "position=< 42202, -31456> velocity=<-4,  3>\n" +
    "position=<-52442, -41971> velocity=< 5,  4>\n" +
    "position=<-52459,  52711> velocity=< 5, -5>\n" +
    "position=<-20916, -41972> velocity=< 2,  4>\n" +
    "position=< 10656,  42191> velocity=<-1, -4>\n" +
    "position=<-41966,  21153> velocity=< 4, -2>\n" +
    "position=<-20912,  21153> velocity=< 2, -2>\n" +
    "position=< 21172, -10415> velocity=<-2,  1>\n" +
    "position=<-41966, -20937> velocity=< 4,  2>\n" +
    "position=<-20898, -31455> velocity=< 2,  3>\n" +
    "position=<-20882, -52492> velocity=< 2,  5>\n" +
    "position=< 21163,  31671> velocity=<-2, -3>\n" +
    "position=<-20924,  21148> velocity=< 2, -2>\n" +
    "position=<-41926, -41975> velocity=< 4,  4>\n" +
    "position=<-31459, -52497> velocity=< 3,  5>\n" +
    "position=<-10384, -10413> velocity=< 1,  1>\n" +
    "position=<-52485, -41980> velocity=< 5,  4>\n" +
    "position=<-41937,  10626> velocity=< 4, -1>\n" +
    "position=< 21170,  42192> velocity=<-2, -4>\n" +
    "position=< 21170,  52713> velocity=<-2, -5>\n" +
    "position=<-31405,  52715> velocity=< 3, -5>\n" +
    "position=<-41934,  52718> velocity=< 4, -5>\n" +
    "position=<-31445, -10415> velocity=< 3,  1>\n" +
    "position=<-41937, -20938> velocity=< 4,  2>\n" +
    "position=< 31681, -52496> velocity=<-3,  5>\n" +
    "position=< 21177, -52494> velocity=<-2,  5>\n" +
    "position=< 52741, -20934> velocity=<-5,  2>\n" +
    "position=< 21184,  21146> velocity=<-2, -2>\n" +
    "position=<-20887,  10634> velocity=< 2, -1>\n" +
    "position=<-52502,  42191> velocity=< 5, -4>\n" +
    "position=< 42244,  21155> velocity=<-4, -2>\n" +
    "position=< 42191,  10625> velocity=<-4, -1>\n" +
    "position=<-52495,  52716> velocity=< 5, -5>\n" +
    "position=<-31413,  10625> velocity=< 3, -1>\n" +
    "position=<-10418, -31452> velocity=< 1,  3>\n" +
    "position=<-10378,  52715> velocity=< 1, -5>\n" +
    "position=< 52747, -31451> velocity=<-5,  3>\n" +
    "position=< 21178,  31672> velocity=<-2, -3>\n" +
    "position=<-20888,  31675> velocity=< 2, -3>\n" +
    "position=< 10657,  52714> velocity=<-1, -5>\n" +
    "position=< 21152,  10630> velocity=<-2, -1>\n" +
    "position=< 10676,  52718> velocity=<-1, -5>\n" +
    "position=< 31722, -10408> velocity=<-3,  1>\n" +
    "position=<-41974, -41979> velocity=< 4,  4>\n" +
    "position=<-31416, -10409> velocity=< 3,  1>\n" +
    "position=< 52715, -20930> velocity=<-5,  2>\n" +
    "position=< 52755, -20931> velocity=<-5,  2>\n" +
    "position=< 31669,  31674> velocity=<-3, -3>\n" +
    "position=< 52750, -10413> velocity=<-5,  1>\n" +
    "position=<-10383,  10628> velocity=< 1, -1>\n" +
    "position=< 31713,  21146> velocity=<-3, -2>\n" +
    "position=< 52763, -52499> velocity=<-5,  5>\n" +
    "position=< 42210, -52501> velocity=<-4,  5>\n" +
    "position=< 10656, -31453> velocity=<-1,  3>\n" +
    "position=< 31666,  21152> velocity=<-3, -2>\n" +
    "position=<-20896, -31453> velocity=< 2,  3>\n" +
    "position=< 21145, -10415> velocity=<-2,  1>\n" +
    "position=<-52461,  21151> velocity=< 5, -2>\n" +
    "position=<-10363, -41972> velocity=< 1,  4>\n" +
    "position=<-20890,  10628> velocity=< 2, -1>\n" +
    "position=<-41973, -41976> velocity=< 4,  4>\n" +
    "position=< 21186, -20934> velocity=<-2,  2>\n" +
    "position=<-52447,  42192> velocity=< 5, -4>\n" +
    "position=<-52458, -20937> velocity=< 5,  2>\n" +
    "position=<-20891,  52714> velocity=< 2, -5>\n" +
    "position=< 21173, -52501> velocity=<-2,  5>\n" +
    "position=< 52747, -31459> velocity=<-5,  3>\n" +
    "position=< 42230, -20931> velocity=<-4,  2>\n" +
    "position=< 52708, -52498> velocity=<-5,  5>\n" +
    "position=< 52755,  21146> velocity=<-5, -2>\n" +
    "position=< 21173,  31675> velocity=<-2, -3>\n" +
    "position=<-20904,  52715> velocity=< 2, -5>\n" +
    "position=< 52742, -20933> velocity=<-5,  2>\n" +
    "position=< 10659, -41973> velocity=<-1,  4>\n" +
    "position=< 52707, -10416> velocity=<-5,  1>\n" +
    "position=<-41974, -10414> velocity=< 4,  1>\n" +
    "position=<-10379, -52493> velocity=< 1,  5>\n" +
    "position=<-41981,  10628> velocity=< 4, -1>\n" +
    "position=<-10403, -41976> velocity=< 1,  4>\n" +
    "position=<-52466,  31676> velocity=< 5, -3>\n" +
    "position=< 52755, -20932> velocity=<-5,  2>\n" +
    "position=<-31425, -20932> velocity=< 3,  2>\n" +
    "position=<-10375, -41973> velocity=< 1,  4>\n" +
    "position=< 42210, -41971> velocity=<-4,  4>\n" +
    "position=< 21188, -20936> velocity=<-2,  2>\n" +
    "position=<-10371, -10415> velocity=< 1,  1>\n" +
    "position=<-31458, -10412> velocity=< 3,  1>\n" +
    "position=<-52454, -10413> velocity=< 5,  1>\n" +
    "position=<-31452, -20938> velocity=< 3,  2>\n" +
    "position=< 21152,  52710> velocity=<-2, -5>\n" +
    "position=<-31453, -10411> velocity=< 3,  1>\n" +
    "position=< 10631,  31667> velocity=<-1, -3>\n" +
    "position=< 31667,  31671> velocity=<-3, -3>\n" +
    "position=<-31453, -20938> velocity=< 3,  2>\n" +
    "position=<-41963,  42188> velocity=< 4, -4>\n" +
    "position=< 42238,  42189> velocity=<-4, -4>\n" +
    "position=< 31681, -41980> velocity=<-3,  4>\n" +
    "position=<-41974, -52498> velocity=< 4,  5>\n" +
    "position=<-31445,  52717> velocity=< 3, -5>\n" +
    "position=<-52453,  10628> velocity=< 5, -1>\n" +
    "position=<-10384,  52713> velocity=< 1, -5>\n" +
    "position=<-10394,  31670> velocity=< 1, -3>\n" +
    "position=< 42235,  42193> velocity=<-4, -4>\n" +
    "position=< 42236,  31670> velocity=<-4, -3>\n" +
    "position=<-41982,  21154> velocity=< 4, -2>\n" +
    "position=< 42234,  21151> velocity=<-4, -2>\n" +
    "position=< 52743, -31457> velocity=<-5,  3>\n" +
    "position=<-20908, -52500> velocity=< 2,  5>\n" +
    "position=< 10633, -10417> velocity=<-1,  1>\n" +
    "position=< 10624,  10627> velocity=<-1, -1>\n" +
    "position=< 31683, -31459> velocity=<-3,  3>\n" +
    "position=<-31453,  10627> velocity=< 3, -1>\n" +
    "position=< 10682, -52492> velocity=<-1,  5>\n" +
    "position=<-10408, -10413> velocity=< 1,  1>\n" +
    "position=<-41946, -41977> velocity=< 4,  4>\n" +
    "position=< 31706, -31452> velocity=<-3,  3>\n" +
    "position=<-52487,  10634> velocity=< 5, -1>\n" +
    "position=<-10371, -20932> velocity=< 1,  2>\n" +
    "position=< 42222,  31673> velocity=<-4, -3>\n" +
    "position=<-10402, -31459> velocity=< 1,  3>\n" +
    "position=< 10633, -20934> velocity=<-1,  2>\n" +
    "position=<-10377, -41975> velocity=< 1,  4>\n" +
    "position=<-52454,  42192> velocity=< 5, -4>\n" +
    "position=< 42214, -41973> velocity=<-4,  4>\n" +
    "position=<-52447,  21148> velocity=< 5, -2>\n" +
    "position=<-31451, -20934> velocity=< 3,  2>\n" +
    "position=< 42231, -52493> velocity=<-4,  5>\n" +
    "position=<-10368, -10415> velocity=< 1,  1>\n" +
    "position=< 10656, -31453> velocity=<-1,  3>\n" +
    "position=< 10635,  10625> velocity=<-1, -1>\n" +
    "position=<-10387, -52501> velocity=< 1,  5>\n" +
    "position=< 42234, -41976> velocity=<-4,  4>\n" +
    "position=<-52466,  10633> velocity=< 5, -1>\n" +
    "position=< 52760,  31667> velocity=<-5, -3>\n" +
    "position=<-10410,  31667> velocity=< 1, -3>\n" +
    "position=<-52469,  21150> velocity=< 5, -2>\n" +
    "position=<-52501, -10412> velocity=< 5,  1>\n" +
    "position=< 21152, -31450> velocity=<-2,  3>\n" +
    "position=<-20938, -10412> velocity=< 2,  1>\n" +
    "position=<-31420,  10627> velocity=< 3, -1>\n" +
    "position=<-31416, -41980> velocity=< 3,  4>\n" +
    "position=< 10671, -10409> velocity=<-1,  1>\n" +
    "position=< 31666, -10411> velocity=<-3,  1>\n" +
    "position=<-31435, -31454> velocity=< 3,  3>\n" +
    "position=< 42218,  10626> velocity=<-4, -1>\n" +
    "position=< 10627, -10415> velocity=<-1,  1>\n" +
    "position=< 31701,  21149> velocity=<-3, -2>\n" +
    "position=< 21149,  31676> velocity=<-2, -3>\n" +
    "position=<-31437,  52709> velocity=< 3, -5>\n" +
    "position=< 42242, -31452> velocity=<-4,  3>\n" +
    "position=<-41956,  10630> velocity=< 4, -1>\n" +
    "position=<-20907,  31669> velocity=< 2, -3>\n" +
    "position=<-20936, -20932> velocity=< 2,  2>\n" +
    "position=<-31441, -41976> velocity=< 3,  4>\n" +
    "position=<-20892, -41976> velocity=< 2,  4>\n" +
    "position=< 42215,  42196> velocity=<-4, -4>\n" +
    "position=<-31432, -52500> velocity=< 3,  5>\n" +
    "position=<-52476, -20934> velocity=< 5,  2>\n" +
    "position=< 21169,  52715> velocity=<-2, -5>\n" +
    "position=<-31445,  10632> velocity=< 3, -1>\n" +
    "position=< 21189,  52709> velocity=<-2, -5>\n" +
    "position=< 42214, -52499> velocity=<-4,  5>\n" +
    "position=<-20895, -41971> velocity=< 2,  4>\n" +
    "position=< 21170,  21151> velocity=<-2, -2>\n" +
    "position=<-52490,  52711> velocity=< 5, -5>\n" +
    "position=<-41966,  10626> velocity=< 4, -1>\n" +
    "position=< 52727,  42188> velocity=<-5, -4>\n" +
    "position=< 10657,  31672> velocity=<-1, -3>\n" +
    "position=< 21162,  21150> velocity=<-2, -2>\n" +
    "position=< 52744,  10626> velocity=<-5, -1>\n" +
    "position=<-31436,  42195> velocity=< 3, -4>\n" +
    "position=<-31457,  31674> velocity=< 3, -3>\n" +
    "position=< 10631, -41973> velocity=<-1,  4>\n" +
    "position=< 21147,  42193> velocity=<-2, -4>\n" +
    "position=< 52707, -52501> velocity=<-5,  5>\n" +
    "position=< 10623, -52492> velocity=<-1,  5>\n" +
    "position=<-41974, -20935> velocity=< 4,  2>\n" +
    "position=<-41934,  10633> velocity=< 4, -1>\n" +
    "position=< 21152, -31450> velocity=<-2,  3>\n" +
    "position=< 21188,  31670> velocity=<-2, -3>\n" +
    "position=<-52455,  52711> velocity=< 5, -5>\n" +
    "position=<-20892,  21147> velocity=< 2, -2>\n" +
    "position=<-20924,  31673> velocity=< 2, -3>\n" +
    "position=< 31665,  31668> velocity=<-3, -3>\n" +
    "position=< 52720, -41979> velocity=<-5,  4>\n" +
    "position=<-20905,  21151> velocity=< 2, -2>\n" +
    "position=< 42226,  31667> velocity=<-4, -3>\n" +
    "position=< 42221, -20933> velocity=<-4,  2>\n" +
    "position=< 31717, -20937> velocity=<-3,  2>\n" +
    "position=< 52708,  42194> velocity=<-5, -4>\n" +
    "position=<-52442, -10408> velocity=< 5,  1>\n" +
    "position=<-41942,  31668> velocity=< 4, -3>\n" +
    "position=< 21156,  52709> velocity=<-2, -5>\n" +
    "position=<-20932, -52499> velocity=< 2,  5>\n" +
    "position=<-41977, -10408> velocity=< 4,  1>\n" +
    "position=<-10371,  52713> velocity=< 1, -5>\n" +
    "position=<-20884, -10416> velocity=< 2,  1>\n" +
    "position=<-20915, -31456> velocity=< 2,  3>\n" +
    "position=<-31421, -31450> velocity=< 3,  3>\n" +
    "position=<-31419,  42192> velocity=< 3, -4>\n" +
    "position=<-10367, -31458> velocity=< 1,  3>\n" +
    "position=<-10410, -10417> velocity=< 1,  1>\n" +
    "position=< 31716, -10415> velocity=<-3,  1>\n" +
    "position=<-52479,  52717> velocity=< 5, -5>\n" +
    "position=< 10647,  52718> velocity=<-1, -5>\n" +
    "position=<-52471, -31450> velocity=< 5,  3>\n" +
    "position=< 42210,  52710> velocity=<-4, -5>\n" +
    "position=<-52453,  31673> velocity=< 5, -3>\n" +
    "position=< 42234, -10410> velocity=<-4,  1>\n" +
    "position=<-52459, -10411> velocity=< 5,  1>\n" +
    "position=<-52477, -31455> velocity=< 5,  3>\n" +
    "position=< 52726,  31671> velocity=<-5, -3>\n" +
    "position=< 21155, -10417> velocity=<-2,  1>\n" +
    "position=< 31689, -52492> velocity=<-3,  5>\n" +
    "position=<-41966, -41976> velocity=< 4,  4>\n" +
    "position=<-20921, -31459> velocity=< 2,  3>\n" +
    "position=< 31670,  52710> velocity=<-3, -5>\n" +
    "position=<-10363, -41977> velocity=< 1,  4>\n" +
    "position=<-20935,  10633> velocity=< 2, -1>\n" +
    "position=< 31721,  52709> velocity=<-3, -5>\n" +
    "position=<-10386, -52495> velocity=< 1,  5>\n" +
    "position=<-10359, -10408> velocity=< 1,  1>\n" +
    "position=< 42202,  10625> velocity=<-4, -1>\n" +
    "position=<-52455, -20933> velocity=< 5,  2>\n" +
    "position=< 52711,  31670> velocity=<-5, -3>\n" +
    "position=<-10363, -20933> velocity=< 1,  2>\n" +
    "position=< 21192, -20932> velocity=<-2,  2>\n" +
    "position=< 31702, -31451> velocity=<-3,  3>\n" +
    "position=<-41966, -20933> velocity=< 4,  2>\n" +
    "position=<-10382, -20937> velocity=< 1,  2>\n" +
    "position=< 42227, -52494> velocity=<-4,  5>\n" +
    "position=< 31713,  10627> velocity=<-3, -1>\n" +
    "position=< 42194, -10413> velocity=<-4,  1>\n" +
    "position=< 21146,  42193> velocity=<-2, -4>\n" +
    "position=<-20889, -41973> velocity=< 2,  4>\n" +
    "position=< 42223,  52718> velocity=<-4, -5>\n" +
    "position=< 10671, -31456> velocity=<-1,  3>\n" +
    "position=< 10668, -20929> velocity=<-1,  2>\n" +
    "position=< 21188, -41977> velocity=<-2,  4>\n" +
    "position=<-41965,  10629> velocity=< 4, -1>\n" +
    "position=<-41957,  31669> velocity=< 4, -3>\n" +
    "position=< 52728, -41980> velocity=<-5,  4>\n" +
    "position=<-10407,  21150> velocity=< 1, -2>\n" +
    "position=<-52463,  42197> velocity=< 5, -4>\n" +
    "position=< 31681,  21150> velocity=<-3, -2>\n" +
    "position=< 31681,  21154> velocity=<-3, -2>\n" +
    "position=< 10652,  21155> velocity=<-1, -2>\n" +
    "position=<-41934,  42191> velocity=< 4, -4>\n" +
    "position=< 10658,  21150> velocity=<-1, -2>\n" +
    "position=< 42202,  52711> velocity=<-4, -5>\n" +
    "position=<-41926, -41971> velocity=< 4,  4>\n" +
    "position=< 52752,  31668> velocity=<-5, -3>\n" +
    "position=<-52470, -20936> velocity=< 5,  2>\n" +
    "position=< 10671, -10412> velocity=<-1,  1>\n" +
    "position=<-52503, -31450> velocity=< 5,  3>\n" +
    "position=< 10623, -41979> velocity=<-1,  4>\n" +
    "position=< 21173,  10633> velocity=<-2, -1>\n" +
    "position=< 10656, -20931> velocity=<-1,  2>\n" +
    "position=<-31451,  42188> velocity=< 3, -4>\n" +
    "position=< 42211, -52498> velocity=<-4,  5>\n" +
    "position=<-20899, -20931> velocity=< 2,  2>\n" +
    "position=< 10647,  21146> velocity=<-1, -2>\n" +
    "position=<-41934, -52492> velocity=< 4,  5>\n" +
    "position=<-10386, -41977> velocity=< 1,  4>\n" +
    "position=< 31670, -52492> velocity=<-3,  5>\n" +
    "position=<-41930, -31451> velocity=< 4,  3>\n" +
    "position=<-10363,  52711> velocity=< 1, -5>\n" +
    "position=< 31689, -10416> velocity=<-3,  1>\n" +
    "position=<-52447, -52501> velocity=< 5,  5>\n" +
    "position=<-41931,  52716> velocity=< 4, -5>\n" +
    "position=<-41934,  42189> velocity=< 4, -4>\n" +
    "position=<-20892, -41977> velocity=< 2,  4>\n" +
    "position=< 52725,  52709> velocity=<-5, -5>\n" +
    "position=< 52720, -10414> velocity=<-5,  1>\n" +
    "position=<-41962, -31459> velocity=< 4,  3>\n" +
    "position=<-20937,  31671> velocity=< 2, -3>\n" +
    "position=< 31669, -10414> velocity=<-3,  1>\n" +
    "position=< 52755, -41979> velocity=<-5,  4>\n" +
    "position=<-41926, -52495> velocity=< 4,  5>\n" +
    "position=< 52744,  42189> velocity=<-5, -4>\n" +
    "position=<-10403,  52717> velocity=< 1, -5>\n" +
    "position=< 31681,  42194> velocity=<-3, -4>\n" +
    "position=<-52471,  42197> velocity=< 5, -4>\n" +
    "position=<-10390, -52501> velocity=< 1,  5>\n" +
    "position=< 21185,  21149> velocity=<-2, -2>\n" +
    "position=< 10651, -41978> velocity=<-1,  4>\n" +
    "position=<-20884,  42189> velocity=< 2, -4>\n" +
    "position=< 10676,  21146> velocity=<-1, -2>\n" +
    "position=<-31453, -20930> velocity=< 3,  2>\n" +
    "position=< 42214,  21153> velocity=<-4, -2>\n" +
    "position=< 21152,  31674> velocity=<-2, -3>\n" +
    "position=<-52487, -52496> velocity=< 5,  5>\n" +
    "position=< 52739,  42189> velocity=<-5, -4>\n" +
    "position=< 52717,  42188> velocity=<-5, -4>\n" +
    "position=< 10679,  21146> velocity=<-1, -2>\n" +
    "position=< 31686, -10417> velocity=<-3,  1>\n" +
    "position=<-31405, -10408> velocity=< 3,  1>\n" +
    "position=< 42234,  42195> velocity=<-4, -4>\n" +
    "position=< 31715, -31453> velocity=<-3,  3>\n" +
    "position=<-31453,  42190> velocity=< 3, -4>\n" +
    "position=< 42229,  10630> velocity=<-4, -1>\n" +
    "position=< 42191,  10626> velocity=<-4, -1>\n" +
    "position=<-31432, -20929> velocity=< 3,  2>\n" +
    "position=<-20884,  10626> velocity=< 2, -1>\n" +
    "position=<-52470, -41978> velocity=< 5,  4>\n" +
    "position=< 52766, -41971> velocity=<-5,  4>\n" +
    "position=<-31429,  52717> velocity=< 3, -5>\n" +
    "position=<-41921,  31676> velocity=< 4, -3>\n" +
    "position=<-31424,  21146> velocity=< 3, -2>\n" +
    "position=< 10650, -20933> velocity=<-1,  2>\n" +
    "position=<-31434, -52496> velocity=< 3,  5>\n" +
    "position=< 21194, -41974> velocity=<-2,  4>\n" +
    "position=< 21147,  42192> velocity=<-2, -4>";


const parser = /position=<\s*(-?\d+),\s+(-?\d+)> velocity=<\s*(-?\d+),\s+(-?\d+)>/;

function loop() {
    this.posX += this.velX;
    this.posY += this.velY;
}
function Point(posX, posY, velX, velY) {
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
}
Point.prototype.loop = loop;
function parseInput(input) {
    const arr = input.split('\n');
    return arr.map(row => {
        const parseResults = parser.exec(row);
        return new Point(...parseResults.slice(1).map(Number));
    });
}

module.exports = parseInput(input);