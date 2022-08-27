const { ethers } = require('hardhat');

async function main() {
    const whitelistContract = await ethers.getContractFactory('Whitelist');

    const deployedWhiteListContract = await whitelistContract.deploy(10);

    await deployedWhiteListContract.deployed();

    console.log('whitelist contract address', deployedWhiteListContract.address);
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
