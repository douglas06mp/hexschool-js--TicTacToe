Vue.component('home',{
  methods: {
    page(){
      this.$emit('goToPage','play');
    }
  },
  template: `
    <div class="home">
      <div class="container">
        <div class="table">
          <div class="box">TIC</div>
          <div class="box"><div class="circle"></div></div>
          <div class="box">
            <div class="cross-empty"></div>
            <div class="cross-empty-line-1"></div>
            <div class="cross-empty-line-2"></div>
          </div>
          <div class="box"><div class="cross"></div></div>
          <div class="box">TAC</div>
          <div class="box"><div class="circle-empty"></div></div>
          <div class="box"><div class="circle-empty"></div></div>
          <div class="box"><div class="cross"></div></div>
          <div class="box">TOE</div>
        </div>
        <button type="button" class="btn btn-home" @click="page">START</button>
      </div>
    </div>
  `
});


Vue.component('play', {
  props: ['score'],
  data(){
    return {
      turn: true,
      winCon: [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]],
      circleArr: [],
      crossArr: [],
      step: 0,
      resultPage: {
        circle: false,
        cross: false,
        draw: false
      }
    };
  },
  methods: {
    playerClick(i,e){
      if(this.turn === true){
        this.circleClick(i,e);
      } else {
        this.crossClick(i,e);
      }
      if(this.step === 9 && !this.resultPage.circle && !this.resultPage.cross){
        this.draw();
      }
    },

    circleClick(i,e){
      e.target.innerHTML = '<div class="circle"></div>';
      this.circleArr.push(i);
      if(this.checkWin(this.circleArr)){
        this.resultPage.circle = true;
        localStorage.setItem('circle', parseInt(this.score.circle) + 1);
        this.score.circle = parseInt(this.score.circle) + 1;
      }
      this.turn = false;
      this.step++;
    },

    crossClick(i,e){
      e.target.innerHTML = '<div class="cross"></div>';
      this.crossArr.push(i);
      if(this.checkWin(this.crossArr)){
        this.resultPage.cross = true;
        localStorage.setItem('cross', parseInt(this.score.cross) + 1);
        this.score.cross = parseInt(this.score.cross) + 1;
      }
      this.turn = true;
      this.step++;
    },

    draw(){
      this.resultPage.draw = true;
    },

    restart(){
      if(!(this.resultPage.circle || this.resultPage.cross || this.resultPage.draw)) {
        this.page();
      }
      this.turn = true;
      this.circleArr = [];
      this.crossArr = [];
      this.step = 0;
      this.resultPage =  {
        circle: false,
        cross: false,
        draw: false
      };
      let boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
        box.innerHTML = "";
      })
    },

    checkWin(arr){
      return this.winCon.some(con => {
        return con.every(num => {
          return arr.indexOf(num) >= 0;
        });
      });
    },

    page(){
      this.$emit('goToPage','home');
    }
  },
  template: `
    <div class="play">
      <div class="container">
        <div class="score">
          <div class="cross-box" :class="{toggleBackground: !turn}"><div class="cross"></div></div>
          <div class="score-box">{{ score.cross }}</div>
          <div class="vs">VS</div>
          <div class="score-box">{{ score.circle }}</div>
          <div class="circle-box" :class="{toggleBackground: turn}"><div class="circle"></div></div>
          <div class="turn" :class="{toggleTurn: turn}">YOUR TURN!</div>
        </div>

        <div class="table" v-if="!(resultPage.circle || resultPage.cross || resultPage.draw)">
          <div class="ver-line line"></div>
          <div class="ver-line line"></div>
          <div class="hor-line line" style="top: 32.4%"></div>
          <div class="hor-line line" style="top: 66.2%"></div>
          <div v-for='i in 9' :key='i' class="box" @click.once='playerClick(i, $event)'></div>
        </div>

        <div class="result" v-if="resultPage.circle">
          <div class="circle"></div>
          <div class="win">WINNER!</div>
        </div>

        <div class="result" v-if="resultPage.cross">
          <div class="cross"></div>
          <div class="win">WINNER!</div>
        </div>

        <div class="result" v-if="resultPage.draw">
          <div class="draw-cross"></div>
          <div class="draw-circle"></div>
          <div class="draw-win">DRAW!</div>
          <div class="draw-win top">DRAW!</div>
          <div class="draw-win bottom">DRAW!</div>
        </div>

        <button type="button" class="btn" @click="restart">RESTART</button>
      </div>
    </div>
  `
});



var app = new Vue({
  el: '#app',
  data: {
    page: 'home',
    score: {
      circle: '',
      cross: ''
    }
  },
  methods: {
    goto(page){
      this.page = page;
    }
  },
  created(){
    if(typeof (Storage) !== "undefined") {
      this.score.circle = localStorage.getItem('circle') || 0;
      this.score.cross = localStorage.getItem('cross') || 0;
    }
  },
  template: `
    <div>
      <home v-if="page === 'home'" @goToPage="goto"/>
      <play
        v-else-if="page === 'play'"
        :score="score"
        @goToPage="goto"
      />
    </div>
  `
});
