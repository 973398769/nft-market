// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketPlace is ReentrancyGuard {
    address public immutable i_owner;

    struct Listing {
        uint price;
        address seller;
    }

    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
    );
    event BuyItem(
        address indexed buyer,
        address indexed nftAddress,
        uint indexed tokenId,
        uint price
    );

    event CancelListing(
        address indexed seller,
        address indexed nftAddress,
        uint indexed tokenId
    );

    mapping(address => mapping(uint => Listing)) s_listing;
    mapping(address => uint) s_proceeds;

    modifier notListed(address nftAddress, uint tokenId) {
        Listing memory listing = s_listing[nftAddress][tokenId];
        require(listing.price <= 0, "Current NFT has listed!");
        _;
    }

    modifier isListed(address nftAddress, uint tokenId) {
        Listing memory listing = s_listing[nftAddress][tokenId];
        require(listing.price > 0, "Current NFT has no listed!");
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        require(
            nft.ownerOf(tokenId) == spender,
            "This NFT is not belong to current address!"
        );
        _;
    }

    constructor() {
        i_owner = msg.sender;
    }

    /**
     * 1.detemine if the NFT is relist
     * 2.detemine if the NFT is belong to current signer
     * 3.the price of NFT is not allowed low than 0
     * 4.detemine if market contract has been approved with the NFT
     */
    function listItem(
        address nftAddress,
        uint price,
        uint tokenId
    )
        external
        notListed(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        require(price > 0, "Nft price must need over zero!");
        //Has the current market contract been approved with the NFT?
        IERC721 nft = IERC721(nftAddress);
        require(
            nft.getApproved(tokenId) == address(this),
            "Current market has not been approved by this nft!"
        );
        s_listing[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }
    

    function buyItem(
        address nftAddress,
        uint tokenId
    ) external payable isListed(nftAddress, tokenId) nonReentrant {
        Listing memory listing = s_listing[nftAddress][tokenId];
        require(listing.price == msg.value, "NFT price not met!");
        s_proceeds[listing.seller] += msg.value;
        delete s_listing[nftAddress][tokenId];
        /**
         * If the caller is not `from`, it must have been allowed to move this token by either {approve} or {setApprovalForAll}.
         * If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe transfer.
         *
         */
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        emit BuyItem(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(
        address nftAddress,
        uint tokenId
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete s_listing[nftAddress][tokenId];
        emit CancelListing(msg.sender, nftAddress, tokenId);
    }

    function updateListing(
        address nftAddress,
        uint tokenId,
        uint newPrice
    )
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        s_listing[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    function withDrawProceeds() external {
        uint proceeds = s_proceeds[msg.sender];
        require(proceeds > 0, "you have no proceeds!");
        s_proceeds[msg.sender] = 0;
        payable(msg.sender).transfer(proceeds);
    }

    function getListing(
        address nftAddress,
        uint tokenId
    ) external view returns (Listing memory) {
        return s_listing[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint) {
        return s_proceeds[seller];
    }
}
