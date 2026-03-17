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

let speletajs_O = false

    var score_O = Number (localStorage.getItem("score_O")) || 0
    var score_X = Number(localStorage.getItem("score_X")) || 0

clearScore.addEventListener("click", () => {
    localStorage.clear()
})



visi_laucini.forEach(laucins => {
    laucins.addEventListener("click", veikt_gajienu, {once: true})
})

function veikt_gajienu(klikskis){
    const laucins = klikskis.target
    const aktivais_speletajs = speletajs_O ? klase_O : klase_X

    if(!speletajs_O) document.body.classList.add("X-turn")
        else{
            document.body.classList.remove("X-turn")
    }

    laucins.classList.add(aktivais_speletajs)

    if(parbaudit_uzvaru(aktivais_speletajs)){
        rezultatu_teksts.textContent = `Spēlētājs ${speletajs_O ? "O" : "X"} uzvarēja!`
        
        rezultatu_logs.classList.add('show')

        if(speletajs_O){
            score_O++
            localStorage.setItem("score_O",score_O)
           
        }else{
            score_X++
            localStorage.setItem("score_X",score_X)
        } 

        score_output.textContent = "X:"+score_X+" | O:"+ score_O
        
    }else if(vari_ir_neizskirts()){
        rezultatu_teksts.textContent = `Neizšķirts!`
        rezultatu_logs.classList.add('show')
    }else{

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
    for(let i = 0; i < uzvaras_nosacijumi.length; i++){
        const laucins = visi_laucini[i]

        if(!laucins.classList.contains(klase_X) && !laucins.classList.contains(klase_O)){
            return false
        }
    }
    return true
}

atjaunot.addEventListener('click', () =>{
    location.reload()
})
