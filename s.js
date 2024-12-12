document.addEventListener("DOMContentLoaded", function() {
    const chessboard = document.getElementById('chessboard');
    
    // Initialize chessboard
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if ((i + j) % 2 === 0) {
                cell.classList.add('black');
            }
            cell.id = `cell-${i}-${j}`;
            chessboard.appendChild(cell);
        }
    }

    // Add the rook image
    const rook = document.createElement('img');
    rook.src = 'chtr.jpg'; // Replace with your rook image URL
    rook.classList.add('rook');
    rook.id = 'rook';
    chessboard.appendChild(rook);
});

function simulatePaths() {
    const n = 8;
    const destX = parseInt(document.getElementById('dest-x').value) - 1; // Adjust for 0-based indexing
    const destY = parseInt(document.getElementById('dest-y').value) - 1; // Adjust for 0-based indexing
    
    if (destX < 0 || destX >= n || destY < 0 || destY >= n) {
        alert("Invalid input. Please enter numbers between 1 and 8.");
        return;
    }

    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    dp[0][0] = 1;

    // Fill the first row and first column
    for (let i = 1; i < n; i++) {
        dp[i][0] = 1;
        dp[0][i] = 1;
    }

    // Fill the rest of the dp table
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }

    // Clear previous paths
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.getElementById(`cell-${i + 1}-${j + 1}`); // Adjust indices
            cell.classList.remove('rook');
            cell.textContent = '';
        }
    }

    // Update the chessboard with the number of shortest paths
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const cell = document.getElementById(`cell-${i + 1}-${j + 1}`); // Adjust indices
            cell.textContent = dp[i][j];
        }
    }

    // Generate all paths
    const allPaths = [];
    generatePaths(0, 0, destX, destY, [], allPaths);

    // Display all paths
    const pathsDiv = document.getElementById('paths');
    pathsDiv.innerHTML = '';
    allPaths.forEach((path, index) => {
        const pathDiv = document.createElement('div');
        pathDiv.textContent = `Path ${index + 1}: ${path.map(([x, y]) => `(${x},${y})`).join(' -> ')}`;
        pathsDiv.appendChild(pathDiv);
    });

    // Display the result
    const result = document.getElementById('result');
    result.textContent = `Number of shortest paths: ${dp[destX][destY]}`;

    // Animate the rook for each path
    animatePaths(allPaths, 0);
}

function generatePaths(x, y, destX, destY, currentPath, allPaths) {
    currentPath.push([x + 1, y + 1]); // Adjust indices

    if (x === destX && y === destY) {
        allPaths.push([...currentPath]);
    } else {
        if (x < destX) {
            generatePaths(x + 1, y, destX, destY, currentPath, allPaths);
        }
        if (y < destY) {
            generatePaths(x, y + 1, destX, destY, currentPath, allPaths);
        }
    }

    currentPath.pop();
}

function animatePaths(paths, index) {
    if (index >= paths.length) return;

    const path = paths[index];
    const rook = document.getElementById('rook');

    let step = 0;
    const interval = setInterval(() => {
        if (step >= path.length) {
            clearInterval(interval);
            setTimeout(() => animatePaths(paths, index + 1), 1000); // Delay before starting the next path
            return;
        }

        const [x, y] = path[step];
        rook.style.transform = `translate(${(y - 1) * 52}px, ${(x - 1) * 52}px)`; // 52px to account for cell size and gap
        step++;
    }, 500);
}
