// Load config
let API_KEY;

fetch("config.json")
  .then((response) => response.json())
  .then((config) => {
    API_KEY = config.API_KEY;
  })
  .catch((error) => {
    console.error("Error loading config:", error);
    alert("Error loading configuration. Please ensure config.json is present.");
  });

document.getElementById("fetchNFTs").addEventListener("click", async () => {
  if (!API_KEY) {
    alert("API key not loaded. Please check your configuration.");
    return;
  }
  const walletAddress = document.getElementById("walletAddress").value;
  if (!walletAddress) {
    alert("Please enter a wallet address");
    return;
  }

  try {
    // Using Alchemy API to fetch NFTs with getNFTsForOwner endpoint
    const baseURL = `https://eth-mainnet.g.alchemy.com/nft/v3/${API_KEY}/getNFTsForOwner`;
    const url = `${baseURL}?owner=${walletAddress}&withMetadata=true&pageSize=100`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const data = await response.json();

    // The API returns an object with ownedNfts array
    if (data.ownedNfts && Array.isArray(data.ownedNfts)) {
      displayNFTs(data.ownedNfts);
    } else {
      console.error("Invalid response format:", data);
      alert("Error: Invalid response format from API");
    }
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    alert(`Error fetching NFTs: ${error.message}`);
  }
});

function displayNFTs(nfts) {
  const container = document.getElementById("nftContainer");
  if (!container) {
    console.error("Could not find nftContainer element");
    return;
  }

  container.innerHTML = ""; // Clear existing content

  nfts.forEach((nft) => {
    const card = document.createElement("div");
    card.className = "nft-card";

    // Get image URL, fallback to placeholder if not available
    const imageUrl =
      nft.image?.cachedUrl ||
      nft.image?.originalUrl ||
      "path/to/placeholder.png";

    // Get NFT name, fallback to token ID if name not available
    const name = nft.name || `Token ID: ${nft.tokenId}`;

    card.innerHTML = `
      <img src="${imageUrl}" alt="${name}" onerror="this.src='path/to/placeholder.png'">
      <h3>${name}</h3>
      <p>${nft.description || "No description available"}</p>
      <p>Contract: ${nft.contract.address}</p>
    `;

    container.appendChild(card);
  });
}
