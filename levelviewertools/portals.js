const fs = require('fs');
const plist = require('plist');

const blocksJSON = fs.readFileSync('../assets/levelviewer/sprites.json');
let blocks = JSON.parse(blocksJSON);


const blocksPLIST = fs.readFileSync('../assets/levelviewer/GJ_GameSheet03-uhd.plist', 'utf8');
const blocksraw = plist.parse(blocksPLIST).frames;

for (block in blocksraw) {
    const regex = /[{}]/g
    let textureRect = blocksraw[block].textureRect.replace(regex, '').split(',');
    let sx = parseInt(textureRect[0]);
    let sy = parseInt(textureRect[1]);
    let swidth = parseInt(textureRect[2]);
    let sheight = parseInt(textureRect[3]);

    let srotation = blocksraw[block].textureRotated ? 90 : 0;

    blocks[block] = {
        x: sx,
        y: sy,
        width: swidth,
        height: sheight,
        rotation: srotation,
        spritesheet: 3
    };
};

console.log(blocks);
fs.writeFile('../assets/levelviewer/sprites.json', JSON.stringify(blocks, null ,4), (err) => {
    if (err) console.log(err);
});
