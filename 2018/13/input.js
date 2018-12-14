const _ = require('lodash');
const colors = require('colors');
const input =
    "                                               /---------\\                                                                                            \n" +
    "                                               |         |/---------------\\                                                                           \n" +
    "        /--------------------------------------+---------++---------------+-----------------------------\\                                             \n" +
    "        |                      /---------------+---------++-------------<-+----------------------------\\|                                             \n" +
    "   /----+----------------------+------\\        |         ||               |                            ||                                             \n" +
    "   |    |                      |      |        |         ||               |                            ||  /-------------------------------------\\    \n" +
    "   |    |                      |      |        |         ||               |                            ||  |                                     |    \n" +
    "   |    |    /-----------------+------+--------+---------++---------------+-------\\              /-----++--+-------------------------------------+-\\  \n" +
    "   |    |    |        /--------+------+--------+---------++-------------\\ |       |              |     ||  |                           /---------+\\|  \n" +
    "   |    |    |        |        |      |        |         ||        /----+-+-------+--------------+-\\  /++--+---------------------------+---------+++\\ \n" +
    "   |    |    |    /---+--------+------+--------+-----\\   ||      /-+----+-+-------+--------------+-+--+++--+-----------\\               |         |||| \n" +
    "   |    |    |    |   |        |      |        |     |   ||      | |    | |       |              | |  |||  |           |               |         |||| \n" +
    "   |    |    |    |  /+--------+------+--------+---\\ |   ||      | |    | |       |              | |  |||  |           |               |         |||| \n" +
    "   |    |    |    |  ||        |      |        |   | |   ||      | |    | |       | /------------+-+--+++--+------\\    |               |         |||| \n" +
    "   |    |    |/---+--++--------+-----\\|        | /-+-+---++------+-+----+-+-----\\/+-+------------+-+--+++--+------+----+-\\             |         |||| \n" +
    "   |    |   /++---+--++--------+-----++--\\     | | | |   ||      | |    | |     |||/+------------+-+--+++--+------+----+-+-------------+---------++++\\\n" +
    "   |    |   |||   |  ||  /-----+-----++--+-----+-+-+-+---++-\\    | |    | |     |||||         /--+-+--+++--+------+----+-+-------------+------\\  |||||\n" +
    "   | /--+---+++---+--++--+-----+-----++--+-----+-+-+-+---++-+----+-+----+-+-----+++++-------\\ |  | |  |||  |      |    | |             \\-<----+--+/|||\n" +
    "   | |/-+---+++---+--++--+-----+--\\  ||  |     | | | |   || |    | |    | |     |||||       | |  \\-+--+++--+------+----+-+--------------------+--+-/||\n" +
    "   | || |   |||   |  ||  |     |  |  ||  |     | | | |   ||/+----+-+----+-+-----+++++-------+-+----+--+++--+------+----+-+--------------\\     |  |  ||\n" +
    "   | || |   |||   |  ||  |    /+--+--++--+-----+-+-+-+---++++----+-+----+-+-----+++++-------+-+----+--+++--+------+----+\\|              |     |  |  ||\n" +
    "   | || |   |||   |  ||  |    ||  |  ||  |     | | | | /-++++----+-+----+-+-----+++++-------+-+----+--+++--+------+----+++----\\         |     |  |  ||\n" +
    "   | || |   |||   |  ||/-+----++--+--++--+-----+-+-+-+-+-++++----+-+----+-+----\\|||||       | |    |  \\++--+------+----+++----+---------+-----+--+--/|\n" +
    "   | || |   |||   \\--+++-+----++--+--++--+-----+-+-+-/ | ||||    | |    | |/---++++++-------+-+----+---++--+------+----+++----+--------\\|     |  |   |\n" +
    "   | || |   |||      ||| |    ||  |  ||  |     | | |   | |\\++----+-+----+-/|   ||||||       | |    |   ||/-+------+\\   |||    |        ||     |  |   |\n" +
    "   | || |   |||      ||| |    ||  |  ||  |     | | |   | | || /--+-+----+--+-\\ ||||||       | |    |   ||| |      ||   |||    |        ||     |  |   |\n" +
    "   | || | /-+++------+++-+----++\\ |  ||  |     | | |   | | || |  | |    | /+-+-++++++-------+-+----+---+++-+------++---+++----+--------++\\    |  |   |\n" +
    "   | || | | |||      |\\+-+----+++-+--++--+-----+-+-+---+-+-++-+--+-+----/ || | ||||||       | |    |   ||| |      ||   |||    |        |||    |  |   |\n" +
    "   | || | | |||      | | |    ||| |  ||  |     | | |   | | || |  | \\------++-+-++++++-------+-+----/   ||| |      ||   |||    |        |||    |  |   |\n" +
    "   | || | | |||    /-+-+-+----+++-+--++--+-----+-+-+---+-+-++\\|  |     /--++-+-++++++-------+-+--------+++-+----\\ ||   |||    |        |||    |  |   |\n" +
    "   | || | | |||    | | | |    ||| |  ||  |     | | |   | | ||||  |     |  || | ||||||       | |   /----+++-+-\\  | ||   |||    |        |||    |  |   |\n" +
    "   | || | | |||  /-+-+-+-+----+++-+--++--+-----+-+-+---+-+-++++--+-----+--++-+-++++++-------+-+---+----+++-+\\|  | ||   |||    |        |||    |  |   |\n" +
    "   | || | | ||v  | v | | |    ||| |  ||  |     | | |   | | ||||  |     |  || | ||||||   /---+-+---+----+++-+++--+-++---+++----+-\\      |||    |  |   |\n" +
    "   | || | | |||  | | | | |    ||| |  ||  |     | | | /-+-+-++++--+-----+--++-+-++++++---+---+-+---+----+++-+++--+-++---+++----+-+--\\   |||    |  |   |\n" +
    "   | || | | |||  | | | | |    ||| |  ||  |     | | | | |/+-++++--+-----+--++-+-++++++---+---+-+---+----+++-+++--+-++---+++----+-+--+---+++----+--+\\  |\n" +
    "   | || | | |||  | | | | |    ||| |  ||  |     | \\-+-+-+++-++++--+-----+--++-+-+/||||   |   | \\---+----+++-+++--+-++---+++----+-+--+---+++----/  ||  |\n" +
    "   | || | | |||  | | | | |    ||| |  ||  |     |   | | ||| |||| /+-----+--++-+-+-++++---+---+-----+----+++-+++--+-++---+++----+-+--+---+++----\\  ||  |\n" +
    "   | || | | |||  | | | | |    ||| |  ||  |     |   | | ||| |||| ||    /+--++-+-+-++++---+---+-----+---\\||| |||  |/++---+++----+-+--+\\  |||    |  ||  |\n" +
    "   | || | | |||  | | | | |    |||/+--++--+\\    |   | | ||| |||| ||    ||  || |/+-++++---+---+-----+---++++-+++--++++---+++----+-+--++--+++---\\|  ||  |\n" +
    "/--+-++-+-+-+++--+-+-+-+-+----+++++\\ ||  ||    |   | | ||| |||| ||    ||  || ||| ||||   | /-+-----+---++++-+++--++++---+++----+-+--++\\ |||   ||  ||  |\n" +
    "|  | || | | |||  | | | | |    |||||| || /++----+---+-+-+++-++++-++----++--++-+++-++++---+-+-+-----+---++++-+++\\ ||||   |||    | |  ||| |||   ||  ||  |\n" +
    "|  | || | | |||  | | | | |    |||||| || |||  /-+---+-+-+++-++++-++----++--++-+++-++++---+\\| |     |   |||\\-++++-+++/   |||/---+-+--+++-+++---++\\ ||  |\n" +
    "|  | || | | |||  | | | | |    |||||| || |||  | |   | | ||| |||| ||    ||  || ||| ||||   ||| |     |   |||  |||| |||    ||||   | |  ||| |||   ||| ||  |\n" +
    "|  | ||/+-+-+++--+-+-+-+-+----++++++-++-+++\\ | |  /+-+-+++-++++-++----++--++-+++-++++---+++-+-----+---+++--++++-+++----++++---+-+--+++-+++-\\ ||| ||  |\n" +
    "| /+-++++-+-+++--+-+-+-+-+----++++++-++-++++-+-+--++-+-+++-++++-++---\\||  || ||| ||||   ||| |     |   |||  |||| |||    ||||   | |  ||| ||| | ||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| || ||||/+-+--++-+-+++-++++-++---+++--++-+++-++++---+++-+-----+---+++--++++-+++----++++---+-+--+++-+++-+\\||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| || |||||| |  || | ||| |||| ||   |||  || ||| ||||   ||| |     |   |||  |||| |||    ||^|   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| || |||||| |  || | |||/++++-++---+++--++-+++-++++--\\||| |     |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| ||/++++++-+--++-+-++++++++-++---+++--++-+++-++++--++++-+--\\  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | |||  | | | | |    |||||| ||||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||\\--+-+-+-+-+----++++++-/|||||||| |  || | |||||||| ||   |||  || ||| ||||  |||| |  |  |   |||  |||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||   | | | | |    ||||||  |||||||| | /++-+-++++++++-++---+++--++-+++-++++--++++-+--+--+---+++-\\|||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||   | | | \\-+----++++++--++++++++-+-+++-+-++++++++-++---+++--++-++/ ||||  |||| |  |  |   ||| ||||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||   | | |   |    ||||||  |||||||| | ||| | |||||||| || /-+++--++-++--++++--++++-+--+-\\|   ||| ||||| |||    ||||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||   | | |   |    \\+++++--++++++++-+-+++-+-++++++++-++-+-+++--++-++--++++--++++-+--+-++---+++-+++++-+++----+/||   | |  ||| ||| ||||| ||  |\n" +
    "| || |||| | ||/--+-+-+---+\\    |||||  |||||||| \\-+++-+-++/||||| || | |||  || ||  ||||  |||| |  | ||   ||| ||||| |||    | |\\---+-+--+++-+++-++++/ ||  |\n" +
    "| || |||| | |||  | | |   v|    |||||  ||||||||   ||| | || ||||| ||/+-+++--++-++--++++--++++-+--+-++--\\||| ||||| |||    | |    | |  ||| ||| ||||  ||  |\n" +
    "|/++-++++-+-+++--+-+-+---++----+++++--++++++++---+++-+-++-+++++-++++-+++--++-++--++++--++++-+--+-++--++++\\||||| |||    | |    | |  ||| ||| ||||  ||  |\n" +
    "|||| |||| | |||  | | |   ||    |||||  |^||||||   |||/+-++-+++++-++++\\|||  |\\-++--++++--++++-+--+-++--++++++++++-+++----+-+----+-+--+++-/|| ||||  ||  |\n" +
    "|||| |||| | |||  | | |/--++----+++++--++++++++---+++++-++-+++++-++++++++--+--++--++++--++++-+--+-++--++++++++++-+++----+\\|    | |  |||  || ||||  ||  |\n" +
    "|||| |||| | |||  |/+-++--++-\\  |||||  ||||||||   ||||| \\+-+++++-++++++++--+--++--++++--++++-+--+-++--++++++++++-+++----+++----/ |  |||  || ||||  ||  |\n" +
    "|||| |||| | |||  ||| ||  || |  |||||/-++++++++---+++++--+-+++++-++++++++--+--++>-++++--++++-+--+-++-\\|||||||||| |||    |||      |  |||  || ||||  ||  |\n" +
    "|||| |||| | |||  ||| ||  || |  |||||| ||||||||   |||||  | ||||| ||||||||  |  ||  ||||  |||| |  | || ||||||||||| |||   /+++------+--+++--++-++++-\\||  |\n" +
    "|v|| |||| | |||  ||| ||  || |  |||||| ||||||||   |||||  | ||||| ||||||||  |  ||  ||||  |||| |  | || ||||||||||| |||   ||||      |  |||  || |||| |||  |\n" +
    "|||\\-++++-+-+++--+++-++--++-+--++++++-/|||||||   |||||  | |||||/++++++++--+--++--++++-\\|||| |  | || ||||||||||| |||   ||||      |  |||  || |||| |||  |\n" +
    "|||  |||| | |||/-+++-++--++-+--++++++--+++++++---+++++-\\| ||||||||||||||  |  ||  |||| ||||| |  | || |||||||\\+++-+++---++++------+--+++--++-++++-+/|  |\n" +
    "|||  |||| | |||| ||| ||  \\+-+--++++++--+++++++---+++++-++-++/|||||||||||  | /++--++++-+++++-+--+-++-+++++++-+++-+++---++++-----\\|  |||  || |||| | |  |\n" +
    "|||  |||| | |||| ||| ||   | |  ||||||  |||||||   ||||| || || |||||||||||  | |||  |||| ||||| |  | ||/+++++++-+++-+++--\\||||     ||  |||  || |||| | |  |\n" +
    "||| /++++-+-++++-+++\\||   | |  \\+++++--+++++++---+++++-++-++-+++++++++++--+-+++--++++-+++++-+--+-++++++/||| ||| |||  |||||  /--++--+++\\ || |||| | |  |\n" +
    "||| ||||| \\-++++-++++++---+-+---/||||  |||||||   ||||| || || |||||||v|||  | |||  |||| ||||| |  | |\\++++-+++-+/| |||  |||||  |  ||  |||| || |||| | |  |\n" +
    "|\\+-+++++---++++-++++++---+-+----++++--+++++++---+++++-++-++-+++++++++++--+-+++--++++-+++++-+--+-+-++++-+/| | | |||  |||||  |  ||  |||| || |||| | |  |\n" +
    "| | |||||   |||| ||||||   | |    ||||  |||||||   ||||| || || |||||||||||  | |||  \\+++-+++++-+--+-+-++++-+-+-+-+-+++--++++/  |  ||  |||| || |||| | |  |\n" +
    "| | |||||   |||| ||||||   | |    ||||  |||||||   ||||| || || |||||||||||  | |||   |||/+++++-+--+-+-++++-+-+-+-+-+++--++++---+--++\\ |||| || |||| | |  |\n" +
    "| | |||||   |||| ||||||   | |    ||||  |||||\\+---+++++-++-++-+++++++++++--+-+++---+++++++++-+--+-+-++++-+-+-+-+-+++--++++---+--+++-++++-++-+/|| | |  |\n" +
    "| | |||||   |||| ||||||   | |/---++++--+++++-+---+++++-++-++-+++++++++++--+-+++---+++++++++-+--+-+-++++-+-+-+-+-+++--++++---+\\ ||| |||| || | || | |  |\n" +
    "| | |||||   |||| ||||||   | ||/--++++--+++++-+---+++++-++-++-+++++++++++--+-+++-\\ ||||||||| |  | | |||| | | | | |\\+--++++---++-+++-+/|| || | || | |  |\n" +
    "| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || |||||||||||  | ||| | ||||||\\++-+--+-+-++++-+-+-+-+-+-+--++++---++-+/| | || || | || | |  |\n" +
    "| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || |||||||||||  | ||| | |^|||| |\\-+--+-+-++++-+-+-+-+-+-+--++++---++-+-+-+-/| || | || | |  |\n" +
    "| | |||||   |||| ||||||   | |||  ||||  ||||| |   ||||| || || ||||||||||| /+-+++-+-++++++-+--+--+-+-++++-+-+-+-+-+-+--++++---++-+-+-+--+-++-+-++-+\\|  |\n" +
    "| | |||||   |\\++-++++++---+-+++--++++--+++++-+---+++++-++-++-+++++++++++-++-+++-+-/||||| |  |  | | |||| | | | | | |  ||||   || | | |  | || | || |||  |\n" +
    "| | |||||   | || ||||||   | |||  ||||  ||||| |   ||||| || || ||||||||||| || ||| |  ||||| |  |  | | |||| | | | | | |  ||||   \\+-+-+-+--/ || | || |||  |\n" +
    "| | \\++++---+-++-+++/||   | |||  ||||  ||||| |   ||||| || || ||||||||||| || ||| |  ||||| |  |  | | |||| | | | | | |  ||||    | | | |    || | || |||  |\n" +
    "| |  ||||   | || ||| ||   | |||  ||||  ||||| |   ||||| || ||/+++++++++++-++-+++-+--+++++-+--+--+-+-++++-+-+-+-+-+-+--++++----+\\| | |    || | || |||  |\n" +
    "| | /++++---+-++-+++\\||/--+-+++--++++--+++++-+---+++++-++\\||||||||||||\\+-++-+++-+--+++++-+--+--+-+-+++/ | | | | | |  ||||    ||| | |    || | || |||  |\n" +
    "| | |||||   | || ||||||| /+-+++--++++--+++++-+---+++++-+++++++++++++++-+-++-+++-+\\ ||||| |  |  | | |||  | | | | | |  ||||    ||| | |    || | || |||  |\n" +
    "|/+-+++++--\\| || |||||||/++-+++--++++-\\||||| |   ||||| ||||||||||||||| | || ||| || \\++++-+--+--+-+-+++--+-+-+-+-+-+--++++----+++-+-+----++-+-++-+++--/\n" +
    "||| ||||\\--++-++-++++++++++-+++--++++-++++++-+---+++++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++--/ | | | | |  |\\++----+++-+-+----++-+-++-/||   \n" +
    "||| ||||   || || ||||\\+++++-+++--++++-++++++-+---++/|| ||||||||||||||| | || ||| ||  |||| |  |  | | |||    | | | | |  | ||    ||| | |    || | ||  ||   \n" +
    "||| ||||   || || |||| ||||| |||  |||| |||||| |   || || ||||||||||||||| | || ||| ||  |||| |  |  | | |||    | | | | |  | ||   /+++-+-+---\\|| | ||  ||   \n" +
    "||| ||||   || || |||| ||||| |||  ||||/++++++-+---++-++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++->-++++\\| |   ||| | ||  ||   \n" +
    "||| ||||   || || |||| ||||| |||  ||||||||||| |   ||/++-+++++++++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++++++-+---+++-+-++--++-\\ \n" +
    "||| ||||   || || |||| ||||| |||  ||||||||||| |   ||||| |||||\\+++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++/||| |   ||| | ||  || | \n" +
    "||| ||||   || || |||| ||||| |||  ||||||||||| |   ||||\\-+++++-+++++++++-+-++-+++-++--++++-+--+--+-+-+++----+-+-+-+-+--+-++---++-+++-/   ||| | ||  || | \n" +
    "||| ||||   || || |||| ||||| |||  \\++++++++/| |   ||||  ||||| ||||||||| | ||/+++-++--++++-+--+-\\| | |||    | | | | |  | ||/--++-+++---\\ ||| | ||  || | \n" +
    "||| ||\\+---++-++-++++-+++++-+++---/||||||| | |   ||||  ||||| ||||||||| | |||||| ||  |||| |  | || | |||    | | | | |  | |||  || |||   | ||| v ||  || | \n" +
    "||| |\\-+---++-++-++++-+++++-+++----+++++++-+-+---++++--+++++-+++++++++-+-++++++-++--++++-+--/ || | |||    | | | | |  | |||  || |||   | ||| | ||  || | \n" +
    "||| |  |   || || |v|| ||||| |||    ||||||| | |   ||||  ||||| ||||||||| | \\+++++-++--++++-+----++-+-+++----+-+-+-+-+--+-+++--++-+++---+-+++-+-++--/| | \n" +
    "||| |  |   || || |||| ||||| |||    ||||||| | |   ||||  ||||| ||||\\++++-+--+++++-++--++++-+----++-+-+++----+-+-+-+-+--+-/||  || |||   | ||| | ||   | | \n" +
    "||| \\--+---++-++-+++/ ||||| |||    ||||||| | |   ||||  |||\\+-++++-++++-+--+++++-++--+++/ |    || | |||    | | | | |  |  ||  || |||   | ||| | ||   | | \n" +
    "|||    |   || || |||  |||\\+-+++----+++++++-+-+---++++--+++-+-++++-++++-+--+++++-+/ /+++--+----++-+-+++----+-+-+-+-+--+--++--++-+++---+-+++-+\\||   | | \n" +
    "|||    | /-++-++-+++--+++-+-+++----+++++++-+-+---++++--+++-+-++++-++++-+--+++++-+--++++--+----++-+-+++----+-+-+\\| |  |  ||  || |||   | ||| ||||   | | \n" +
    "|||    | | || || |||  ||| | |||    ||||||| | \\---++++--+++-+-++++-++++-+--+++++-+--++++--/    || | |||    | | ||| |  |  ||  || |||   | ||| ||||   | | \n" +
    "|||    | | || || |||  ||| | v||/---+++++++-+-----++++-\\||| | |||| |||| |  ||||\\-+--++++-------++-+-+++----+-+-+++-+--+--++--++-+++---+-+++-++/|   | | \n" +
    "|||    | | |\\-++-+++--+++-+-++++---++++++/ |     |||| |||| | |\\++-++++-+--+++/  |/-++++-------++-+-+++----+-+-+++-+--+-\\||  || |||   | ||| || |   | | \n" +
    "|||    | | |  || |||  ||| | ||\\+---++++++--+-----++++-++++-+-+-++-++++-+--+++---/| ||||       || |/+++--->+-+-+++-+--+-+++--++\\|||   | ||| || |   | | \n" +
    "|||    | | |  || |||  ||| | || |   ||||||  |     |||| |||| | | || |||| |  |||    | ||||       || |||^|  /-+-+-+++-+--+-+++--++++++---+-+++-++-+---+\\| \n" +
    "|||    | | |  || |||  ||| | || |   ||||||  |     |||| ||\\+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-+-+-+++-+--+-+++--++++++---+-+++-++-+---/|| \n" +
    "|||    | | |  || |||  ||| | || |   |||||\\--+-----++++-++-+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-+-+-/|| |  | |||  ||||||   | ||| || |    || \n" +
    "|||    | | |  || |||  ||| | || |   |||||   |     \\+++-++-+-+-+-++-++++-+--+++----+-++++-------++-+++++--+-/ |  || |  | |||  ||||||/--+-+++-++-+-\\  || \n" +
    "|||    | | |  || |||  ||| | || |   |||||   |      ||| || | | | || |||| \\--+++----+-++++-------++-+++++--+---+--+/ |  | |||  |||||||  | ||| || | |  || \n" +
    "|||    |/+-+--++-+++--+++-+-++-+---+++++--\\|      ||| || | | | || ||||    |||    | |\\++-------++-+++++--+---+--+--/  | |||  |||||||  | ||| || | |  || \n" +
    "|||    ||| |  || |||  ||| | || |   |||||  ||      ||| || | | | || \\+++----+++----+-+-++-------++-++++/  |   |  |     | |||  |||||||  | ||| || | |  || \n" +
    "|||    ||| |  ||/+++--+++-+-++-+---+++++--++------+++-++-+-+-+-++--+++----+++----+-+-++-------++-++++---+---+--+-----+\\|||  \\++++++--+-/|| || | |  || \n" +
    "|||    ||| |  ||||||  ||| | || |   |||||  ||      |\\+-++-+-+-+-++--+++----+++----+-+-++-------++-++++---+---+--+-----+++++---++++++--+--++-++-+-+--+/ \n" +
    "|||    ||| |  ||||||  ||| | || |   |||||  ||      | | || | | | ||  |||    \\++----+-+-++-------++-++++---+---+--+-----+++++---++++++--+--+/ || | |  |  \n" +
    "|||    ||| |  ||||||  ||| | || \\---+++++--++------+-+-/| | | | ||  |||     ||    | | ||       || ||||   |   |  |     |||||   ||||||  |  |  || | |  |  \n" +
    "|||    ||| |  |||||\\--+++-+-++-----+++++--++------+-+--+-+-+-/ ||  |||     ||    | | \\+-------++-++++---+---+--+-----+++++---++++/|  |  |  || | |  |  \n" +
    "|||    ||| |  |||||  /+++-+-++-----+++++--++------+-+--+-+-+---++--+++-----++----+-+--+----\\  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  \n" +
    "|||    ||| |/-+++++--++++-+-++-----+++++--++------+-+--+-+-+---++--+++----\\||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  \n" +
    "||\\----+++-++-+++++--++++-+-++-----+++++--++------+-+--+-+-+---++--++/    |||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |  |  || | |  |  \n" +
    "||     |||/++-+++++--++++-+-++-\\   |||||  ||      | |  | | \\---++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---++++-+--+--/  || | |  |  \n" +
    "||     |||||| |||||  |||| | || |   |||||  ||      \\-+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---++++-+--+-----/| | |  |  \n" +
    "||     |||||| |||||  |||| | || |   |||||  ||        |  | |     ||  ||     |||    | |  |    |  || ||||   |   |  |     |||||   |||| |  |      | | |  |  \n" +
    "||     |||||| |||||  |||| | || |   ||\\++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--+-----+++++---+++/ |  |      | | |  |  \n" +
    "||     ||\\+++-+++++--++++-+-++-+---++-++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---+--/     |||||   |||  |  |      | | |  |  \n" +
    "||     || ||| |||\\+--++++-+-++-+---++-++--++--------+--+-+-----++--++-----+++----+-+--+----+--++-++++---+---/        |||||   |||  |  |      | | |  |  \n" +
    "|\\-----++-+/| ||| |  |||| | || |   || ||  ||        |  | |     ||  ||  /--+++----+-+--+----+\\ || ||||   \\------------+++++---+++--+--+------+-+-+--/  \n" +
    "|      || | | ||| \\--++++-+-/| |   || ||  ||        |  | |     ||  ||  |  |||    | \\--+----++-++-++++----------------+++++---+++--+--+------/ | |     \n" +
    "|      || | | |\\+----++++-+--+-+---++-++--++--------+--/ |     ||  ||  |  ||\\----+----+----++-++-++++----------------+++++---++/  |  |        | |     \n" +
    "|      || | | | |    |||| |  | |   |\\-++--++--------+----+-----++--++--+--++-----+----+----++-++-+++/                |||||   ||   |  |        | |     \n" +
    "|      || | | | |    |||\\-+--+-+---+--/|  ||        |    |     ||  ||  |  ||     |    |    || || ||\\-----------------/||||   ||   |  |        | |     \n" +
    "|      || | | \\-+----+++--/  | |   |   |  ||        |    |     ||  ||  |  ||     |    |    || || ||                   ||||   ||   |  |        | |     \n" +
    "|      || \\-+---+----+++-----+-/   |   |  ||        |    |     \\+--++--+--++-----+----/    || || ||                   ||||   ||   |  |        | |     \n" +
    "|      |\\---+---+----+++-----+-----+---+--/|        |    |      \\--++--+--++-----+---------++-++-++-------------------++++---++---+--+--------/ |     \n" +
    "|      |    |   |    |\\+-----+-----+---+---+--------+----+---------++--+--++-----+---------++-++-++-------------------++/\\---++---+--/          |     \n" +
    "|      |    |   |    \\-+-----+-----+---+---+--------+----+---------++--+--++-----+---------/| || ||                   ||     ||   |             |     \n" +
    "|      |    |   |      |     |     |   |   |        |    |         ||  |  ||     |          | || ||                   ||     ||   |             |     \n" +
    "\\------+----+---+------+-----+-----/   |   |        |    |         ||  |  ||     \\----------+-++-++-------------------+/     ||   |             |     \n" +
    "       |    |   |      |     \\---------+---+--------+----+---------++--+--++----------------+-++-++-------------------+------/|   |             |     \n" +
    "       |    |   |      \\---------------+---+--------+----/         ||  |  ||                | || ||                   |       |   |             |     \n" +
    "       |    |   |                      |   |        |              ||  |  |\\----------------+-/| ||                   |       |   |             |     \n" +
    "       |    |   |                      |   |        \\--------------+/  \\--+-----------------/  | ||                   |       |   \\-------------/     \n" +
    "       |    |   |                      |   |                       \\------+--------------------+-/|                   |       |                       \n" +
    "       |    |   |                      \\---+------------------------------+--------------------/  |                   |       |                       \n" +
    "       \\----+---+--------------------------/                              |                       \\-------------------+-------/                       \n" +
    "            \\---+---------------------------------------------------------/                                           |                               \n" +
    "                \\-----------------------------------------------------------------------------------------------------/                               \n";

const testInput =
    "/->-\\        \n" +
    "|   |  /----\\\n" +
    "| /-+--+-\\  |\n" +
    "| | |  | v  |\n" +
    "\\-+-/  \\-+--/\n" +
    "  \\------/  ";

const rows = input.split('\n');
const left = 'left',
    right = 'right',
    up = 'up',
    down = 'down',
    straight = 'straight',
    horizontal = 'horizontal',
    vertical = 'vertical',
    intersection = 'intersection',
    curve_a = 'curve_a',
    curve_b = 'curve_b';
const directions = {
    left,
    right,
    up,
    down
};
const trackTypes = {
    horizontal,
    vertical,
    intersection,
    curve_a,
    curve_b
};

const leftTurnMap = {
    left: down,
    down: right,
    right: up,
    up : left
};

const rightTurnMap = {
    left : up,
    up : right,
    right : down,
    down : left
};

const curveAMap = {
    left : up,
    up   : left,
    down : right,
    right: down
};

const curveBMap = {
    up : right,
    right : up,
    left : down,
    down : left
};

const intersectionChoiceAI = [leftTurnMap, false, rightTurnMap];

const carts = [],
    track = {};

function tick() {
    switch(this.direction) {
        case directions.left :
            this.x --;
            break;

        case directions.right :
            this.x ++;
            break;

        case directions.up :
            this.y --;
            break;

        case directions.down :
            this.y ++;
            break;

        default :
            throw `Unkown direction ${this.direction}`;
    }

    const trackPiece = track[`${this.x},${this.y}`];
    if(!trackPiece) {
        console.log(this);
        throw `Couldn't find track piece at ${x},${y}`;
    }
    switch (trackPiece.type) {
        case trackTypes.intersection:
            const turnMap = intersectionChoiceAI[this.intersectionChoiceIndex];
            if(turnMap) {
                this.direction = turnMap[this.direction];
            }
            this.intersectionChoiceIndex ++;
            if(this.intersectionChoiceIndex === intersectionChoiceAI.length) {
                this.intersectionChoiceIndex = 0;
            }
            break;

        case trackTypes.curve_a :
            this.direction = curveAMap[this.direction];
            break;

        case trackTypes.curve_b :
            this.direction = curveBMap[this.direction];
            break;

    }
    this.tickCount ++;
}

function printLoc() {
    return `${this.x},${this.y}`;
}

function printCart() {

    if(this.dead) {
        return 'X'.bgRed.bold;
    }
    switch(this.direction) {
        case directions.up:
            return '↑'.bgGreen.bold;
        case directions.right:
            return '→'.bgGreen.bold;
        case directions.left:
            return '←'.bgGreen.bold;
        case directions.down:
            return '↓'.bgGreen.bold;
    }
}

function printTrack() {
    switch(this.type) {
        case trackTypes.curve_b :
            return '/';
        case trackTypes.curve_a :
            return '\\';
        case trackTypes.intersection :
            return '+';
        case trackTypes.horizontal :
            return '-';
        case trackTypes.vertical :
            return '|';
    }
}

function Track(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
}

Track.prototype.print = printTrack;

function Cart(x, y, direction) {
    this.originalX = x;
    this.originalY = y;
    this.tickCount = 0;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.intersectionChoiceIndex = 0;
}

Cart.prototype.tick = tick;
Cart.prototype.printLoc = printLoc;
Cart.prototype.print = printCart;

_.forEach(rows, (row, y) => {
   _.forEach(row, (character, x) => {
       switch(character) {
           case '>' :
               carts.push(new Cart(x, y, directions.right));
               track[`${x},${y}`] = new Track(x, y, trackTypes.horizontal);
               break;

           case '<' :
               carts.push(new Cart(x,y, directions.left));
               track[`${x},${y}`] = new Track(x, y, trackTypes.horizontal);
               break;

           case '^' :
               carts.push(new Cart(x,y, directions.up));
               track[`${x},${y}`] = new Track(x, y, trackTypes.vertical);
               break;

           case 'v' :
               carts.push(new Cart(x, y, directions.down));
               track[`${x},${y}`] = new Track(x, y, trackTypes.vertical);
               break;

           case '-' :
               track[`${x},${y}`] = new Track(x, y, trackTypes.horizontal);
               break;

           case '|' :
               track[`${x},${y}`] = new Track(x, y, trackTypes.vertical);
               break;

           case '\\' :
               track[`${x},${y}`] = new Track(x, y, trackTypes.curve_a);
               break;

           case '/' :
               track[`${x},${y}`] = new Track(x, y, trackTypes.curve_b);
               break;

           case '+' :
               track[`${x},${y}`] = new Track(x, y, trackTypes.intersection);
               break;

           case ' ' :
               break;

           default :
               throw `Unknown character ${character}`;

       }
   });
});

module.exports = {
    carts,
    track
};