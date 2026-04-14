console.log("JS strādā")
const klase_X = 'x'
const klase_O = 'circle'
/*
0 1 2
3 4 5
6 7 8
*/
const uzvaras_nosacijumi = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
const visi_laucini = document.querySelectorAll('.cell')
const rezultatu_logs = document.querySelector('#resultBox')
const rezultatu_teksts = document.querySelector('#resultInfo')
const atjaunot = document.querySelector('#restartButton')
const attelot_speletaju = document.querySelector('#display')
const score_output = document.querySelector("#punkti")
const clearScore = document.querySelector("#clearScore")
const timerEl = document.querySelector("#timer")

let speletajs_O = false
var score_O = Number(localStorage.getItem("score_O")) || 0
var score_X = Number(localStorage.getItem("score_X")) || 0

let startTime = null
let timerRunning = false
localStorage.removeItem("elapsed")

function formatTime(ms) {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${String(m).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
}

const timerInterval = setInterval(() => {
    if (!timerRunning) return
    const elapsed = Date.now() - startTime
    timerEl.textContent = formatTime(elapsed)
}, 1000)

clearScore.addEventListener("click", () => {
    localStorage.clear()
    startTime = null
    timerRunning = false
    timerEl.textContent = "00:00"
})

visi_laucini.forEach(laucins => {
    laucins.addEventListener("click", veikt_gajienu, {once: true})
})

function veikt_gajienu(klikskis){
    if (!timerRunning) {
        timerRunning = true
        startTime = Date.now() - 1000
        timerEl.textContent = "00:01"
    }

    const laucins = klikskis.target
    const aktivais_speletajs = speletajs_O ? klase_O : klase_X
    if(!speletajs_O) document.body.classList.add("X-turn")
        else{
            document.body.classList.remove("X-turn")
    }
    laucins.classList.add(aktivais_speletajs)

    const uzvaras_kombinacija = parbaudit_uzvaru(aktivais_speletajs)
    if(uzvaras_kombinacija){
        rezultatu_teksts.textContent = `Spēlētājs ${speletajs_O ? "O" : "X"} uzvarēja!`
        uzzimejiet_liniju(uzvaras_kombinacija)
        clearInterval(timerInterval)
        rezultatu_logs.classList.add('show')
        if(speletajs_O){
            score_O++
            localStorage.setItem("score_O", score_O)
        } else {
            score_X++
            localStorage.setItem("score_X", score_X)
        }
        score_output.textContent = "X:" + score_X + " | O:" + score_O
    } else if(vari_ir_neizskirts()){
        rezultatu_teksts.textContent = `Neizšķirts!`
        clearInterval(timerInterval)
        rezultatu_logs.classList.add('show')
    } else {
        speletajs_O = !speletajs_O
        attelot_speletaju.textContent = speletajs_O ? "O" : "X"
    }
}

function parbaudit_uzvaru(aktivais){
    for(let i = 0; i < uzvaras_nosacijumi.length; i++){
        const kombinacija = uzvaras_nosacijumi[i]
        const a = kombinacija[0]
        const b = kombinacija[1]
        const c = kombinacija[2]
        if( visi_laucini[a].classList.contains(aktivais) &&
            visi_laucini[b].classList.contains(aktivais) &&
            visi_laucini[c].classList.contains(aktivais)){
                return kombinacija
        }
    }
    return false
}

function vari_ir_neizskirts(){
    for(let i = 0; i < visi_laucini.length; i++){
        const laucins = visi_laucini[i]
        if(!laucins.classList.contains(klase_X) && !laucins.classList.contains(klase_O)){
            return false
        }
    }
    return true
}

function uzzimejiet_liniju(kombinacija) {
    kombinacija.forEach(i => visi_laucini[i].classList.add('uzvaretajs'))
    const board = document.querySelector('.board')
    const boardRect = board.getBoundingClientRect()
    const a = visi_laucini[kombinacija[0]].getBoundingClientRect()
    const c = visi_laucini[kombinacija[2]].getBoundingClientRect()
    const x1 = a.left + a.width / 2 - boardRect.left
    const y1 = a.top  + a.height / 2 - boardRect.top
    const x2 = c.left + c.width / 2 - boardRect.left
    const y2 = c.top  + c.height / 2 - boardRect.top
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'win-line')
    svg.setAttribute('width', boardRect.width)
    svg.setAttribute('height', boardRect.height)
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', x1); line.setAttribute('y1', y1)
    line.setAttribute('x2', x2); line.setAttribute('y2', y2)
    svg.appendChild(line)
    board.appendChild(svg)
}

atjaunot.addEventListener('click', () => {
    location.reload()
})
