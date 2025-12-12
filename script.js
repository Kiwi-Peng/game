const container = document.getElementById('puzzle-container');
const successMessage = document.getElementById('success-message');

// 正確的順序陣列 (0代表左上, 1代表右上, 2代表左下, 3代表右下)
const correctOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// 目前的遊戲狀態，一開始先複製一份正確順序
let currentPieces = [...correctOrder];

// 用來記錄第一次點擊的拼圖
let selectedPieceElement = null;

// 1. 初始化遊戲
function initGame() {
    // 洗牌：打亂 currentPieces 的順序
    shuffleArray(currentPieces);
    
    // 清空容器
    container.innerHTML = '';
    
    // 根據打亂後的順序，建立 DOM 元素
    currentPieces.forEach((pieceIndex, i) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        
        // 關鍵： data-correct-pos 記錄了這片拼圖「原本應該在哪裡」
        // 這會對應到 CSS 裡的 background-position 設定
        piece.setAttribute('data-correct-pos', pieceIndex);
        
        // 加入點擊事件監聽
        piece.addEventListener('click', onPieceClick);
        
        container.appendChild(piece);
    });
}

// 處理點擊事件
function onPieceClick(e) {
    const clickedPiece = e.target;

    if (selectedPieceElement === null) {
        // 第一次點擊：選取這片拼圖
        selectedPieceElement = clickedPiece;
        selectedPieceElement.classList.add('selected');
    } else if (selectedPieceElement === clickedPiece) {
        // 點擊了同一片：取消選取
        selectedPieceElement.classList.remove('selected');
        selectedPieceElement = null;
    } else {
        // 第二次點擊了不同的拼圖：進行交換
        swapPieces(selectedPieceElement, clickedPiece);
        
        // 交換完成後，取消選取狀態
        selectedPieceElement.classList.remove('selected');
        selectedPieceElement = null;
        
        // 檢查是否通關
        checkWin();
    }
}

// 交換兩個 DOM 元素的位置
function swapPieces(pieceA, pieceB) {
    // 使用一個暫存的替身來幫助交換
    const temp = document.createElement('div');
    container.insertBefore(temp, pieceA);
    container.insertBefore(pieceA, pieceB);
    container.insertBefore(pieceB, temp);
    container.removeChild(temp);
}

// 檢查勝利條件
function checkWin() {
    const currentDomElements = container.querySelectorAll('.puzzle-piece');
    let isWin = true;

    // 遍歷現在畫面上的每一片拼圖
    currentDomElements.forEach((piece, index) => {
        // 獲取這片拼圖「應該在的位置」
        const correctPos = parseInt(piece.getAttribute('data-correct-pos'));
        // 如果它現在的位置 (index) 不等於它應該在的位置 (correctPos)
        if (index !== correctPos) {
            isWin = false;
        }
    });

    if (isWin) {
        successMessage.classList.remove('hidden');
        // 為了慶祝，稍微延遲一下把邊框去掉，讓玩家看清楚完整圖片
        setTimeout(() => {
             container.style.gap = "0";
             container.style.border = "none";
        }, 500);
    }
}

// 工具函數：隨機打亂陣列 (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    // 為了確保一定會打亂，簡單檢查一下，如果運氣不好沒亂就再洗一次
    if (array[0] === 0 && array[1] === 1 && array[2] === 2 && array[3] === 3) {
       shuffleArray(array);
    }
}

// 啟動遊戲

initGame();
