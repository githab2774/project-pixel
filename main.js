
function get_result_from_cookie() {
    let cookies = document.cookie.split('; ')
    console.log(cookies)
    for (let i = 0; i < cookies.length; i += 1) {
        let cookie = cookies[i].split('=')
        console.log(cookie)
        if (cookie[0] == 'pixel-result') {
            return cookie[1]
        }
    }
    return '0' * 450
}


var CURRENT_COLOR = "rgb(255, 102, 46)"; 
var DEFAULT_COLOR = "rgb(62, 62, 62)";   
var IS_CLICKED = false; 
var FILL_MODE = false; 



var COLOR_MAP = {
    "red": "rgb(255, 102, 46)",
    "green": "rgb(26, 218, 84)",
    "blue": "rgb(83, 15, 255)",
    "yellow": "rgb(255, 236, 26)",
    "skyblue": "rgb(142, 229, 255)"
};


document.addEventListener('mousedown', function() {
    IS_CLICKED = true;
});

document.addEventListener('mouseup', function() {
    IS_CLICKED = false;
});


let field = document.querySelector('.field')
let temp_result = get_result_from_cookie()
if (temp_result != '0') {
    for (let i = 0; i < 450; i+=1) {
        let cell = document.createElement('div')
        cell.classList.add('cell')
        cell.setAttribute('id', `${i}`)
        cell.style.backgroundColor = COLORS[parseInt(temp_result[i])]
        field.appendChild(cell)
    }
} else {
	for (let i = 0; i < 450; i += 1) {
		let cell = document.createElement('div')
		cell.classList.add('cell')
		cell.setAttribute('id', `${i}`) 
		field.appendChild(cell)
	}
}


let cells = document.querySelectorAll('.cell')
for (let i = 0; i < cells.length; i++) {
    let cell = cells[i];
    
    
    cell.addEventListener('click', function() {
        cell.style.backgroundColor = CURRENT_COLOR;
    })
    
    
    cell.addEventListener('mouseover', function() {
        if (IS_CLICKED) {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    })
    
    
    cell.addEventListener('mousedown', function() {
         if (FILL_MODE) {
            
            let cell_id = parseInt(cell.getAttribute('id'));
            
            anime({
                targets: '.cell',
                backgroundColor: CURRENT_COLOR,
                easing: 'easeInOutQuad',
                duration: 500,
                delay: anime.stagger(50, {grid: [30, 15], from: cell_id}),
            });
            
            
            setTimeout(() => {
                for (let j = 0; j < cells.length; j++) {
                    cells[j].style.backgroundColor = CURRENT_COLOR;
                }
            }, 1000); 
        } else {
            cell.style.backgroundColor = CURRENT_COLOR;
        }
    })
	
	
}

let color_cells = document.querySelectorAll('.color-cell')
for (let i = 0; i < color_cells.length; i++) {
    let color_cell = color_cells[i];
    color_cell.addEventListener('click', function() {
        let colorClass = "";
        if (color_cell.classList.contains("red")) colorClass = "red";
        else if (color_cell.classList.contains("green")) colorClass = "green";
        else if (color_cell.classList.contains("blue")) colorClass = "blue";
        else if (color_cell.classList.contains("yellow")) colorClass = "yellow";
        else if (color_cell.classList.contains("skyblue")) colorClass = "skyblue";
        
        
        CURRENT_COLOR = COLOR_MAP[colorClass];
		
		
        FILL_MODE = false;
        
        
        document.querySelector('.selected').classList.remove('selected')
        color_cell.classList.add('selected')
    })
}


document.querySelector('.eraser').addEventListener('click', function() {
    CURRENT_COLOR = DEFAULT_COLOR;
	FILL_MODE = false; 
    
    
    document.querySelector('.selected').classList.remove('selected')
    
    
    this.classList.add('selected')
})


document.querySelector('.fill-tool').addEventListener('click', function() {
    FILL_MODE = true;
    
    document.querySelector('.selected').classList.remove('selected')
    this.classList.add('selected')
})


var COLORS = [
    "rgb(62, 62, 62)",
    "rgb(255, 102, 46)",
    "rgb(26, 218, 84)",
    "rgb(83, 15, 255)",
    "rgb(255, 236, 26)",
    "rgb(142, 229, 255)" ]; 


setInterval(function() {
    let result = '';
    let temp_cells = document.querySelectorAll('.cell');
    
    for (let i = 0; i < temp_cells.length; i += 1) {
        let cell = temp_cells[i];
        let color = cell.style.backgroundColor;
        
        
        let colorIndex = "0"; 
        for (let j = 0; j < COLORS.length; j++) {
            if (color === COLORS[j]) {
                colorIndex = j.toString();
                break;
            }
        }
        
        result += colorIndex;
    }
    document.cookie = `pixel-result=${result};max-age=100000`;
}, 60000);


document.querySelector('.save-tool').addEventListener('click', function() {
    domtoimage.toJpeg(field, {quality: 2})
    .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        let link = document.createElement('a');
        link.download = 'pixel.jpg';
        link.href = dataUrl;
        link.click();
    })
    .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
})