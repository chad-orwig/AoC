const _ = require('lodash');
const {carts, track} = require('./input');

const cartMap = _.chain(carts)
    .map(cart => [cart.printLoc(), cart])
    .fromPairs()
    .value();

function loop() {
    const sortedCarts = _.orderBy(Object.values(cartMap), ['y', 'x'], ['asc', 'asc']);
    const removedCarts = new Set();
    sortedCarts.forEach(cart => {
        if(removedCarts.has(cart)) {
            return;
        }
        delete cartMap[cart.printLoc()];
        cart.tick();
        const wreckedCart = collisionCheck(cart);
        if(wreckedCart) {
            removedCarts.add(wreckedCart);

        }
    });
}

function collisionCheck(cart) {
    const loc = cart.printLoc();
    if(cartMap[loc]) {
        cart.dead = true;
        const wreckedCart = cartMap[loc];
        wreckedCart.dead = true;
        delete cartMap[loc];
        return wreckedCart;
    }
    else {
        cartMap[loc] = cart;
    }

}

function print() {
    const rows = [];
    _.forEach(track, piece => {
        const row = rows[piece.y] || [];
        rows[piece.y] = row;
        row[piece.x] = piece.print();
    });
    _.forEach(rows, row => {
        for(let i = 0; i < row.length; i++) {
            if(!row[i]) {
                row[i] = ' ';
            }
        }
    });
    _.forEach(carts, cart => {
        rows[cart.y][cart.x] = cart.print();
    });
    const drawing = rows.map(row => row.join('')).join('\n');
    console.log(drawing);
}

function recurse() {
    loop();
    print();
    const remainingCarts = Object.values(cartMap);
    if(remainingCarts.length === 1) {
        console.log(remainingCarts[0]);
        process.exit();
    }
    setTimeout(recurse, 150);
}

recurse();