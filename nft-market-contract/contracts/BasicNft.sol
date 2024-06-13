// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant fashion_uri =
        "https://ipfs.filebase.io/ipfs/QmTz6ajnLUXwaXCjZ7Zvdk2nXGdQNspnLPsgwZFDP45tUJ/fashion.json";
    string public constant ghost_uri =
        "https://ipfs.filebase.io/ipfs/QmTz6ajnLUXwaXCjZ7Zvdk2nXGdQNspnLPsgwZFDP45tUJ/ghost.json";
    string public constant godfather_uri =
        "https://ipfs.filebase.io/ipfs/QmTz6ajnLUXwaXCjZ7Zvdk2nXGdQNspnLPsgwZFDP45tUJ/godfather.json";
    string public constant smoke_uri =
        "https://ipfs.filebase.io/ipfs/QmTz6ajnLUXwaXCjZ7Zvdk2nXGdQNspnLPsgwZFDP45tUJ/smoke.json";
    uint256 private s_tokenCounter;

    constructor() ERC721("Monkey", "APE") {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        if (s_tokenCounter % 4 == 0) {
            return fashion_uri;
        } else if (s_tokenCounter % 4 == 1) {
            return ghost_uri;
        } else if (s_tokenCounter % 4 == 2) {
            return godfather_uri;
        } else {
            return smoke_uri;
        }
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
