
function matchesPort(port) {
    return port === this.port0 || port === this.port1;
}

function getOtherPort(port) {
    return port === this.port0 ? this.port1 : this.port0;
}

function Magnent(descriptor) {
    const portStrings = descriptor.split('/');
    this.ports = portStrings.map(Number);
    this.port0 = this.ports[0];
    this.port1 = this.ports[1];
    this.matchesPort = matchesPort;
    this.getOtherPort = getOtherPort;
}

module.exports = Magnent;