var sw=20, sh=20, tr=30, td=30; //方块的宽高，行数列数。
var snake = null;
var food = null;
var game = null;
function Square(x,y,classname){
    //这是一个创建函数
    this.x=x*sw;
    this.y=y*sh;
    //注意this其实是指window这个对象
    this.class=classname;
    this.viewContent=document.createElement("div");//创建一个新的元素
    this.viewContent.className=this.class;
    this.parent=document.getElementById("snakewrap");
    // 将父级与父级绑定
}
Square.prototype.create = function(){
    //这里我还是有点不太懂。
    this.viewContent.style.position='absolute';
    this.viewContent.style.width=sw+'px';
    this.viewContent.style.height=sh+'px';
    this.viewContent.style.left=this.x+'px';
    this.viewContent.style.top=this.y+'px';
    //上面是创建方块DOM
    this.parent.appendChild(this.viewContent);
}
Square.prototype.remove = function(){
    this.parent.removeChild(this.viewContent);
}
function Snake(){
    this.head=null;//存蛇头的信息
    this.tail=null;
    this.pos=[];//存蛇身上每一块方块的位置，这是一个二维数组


    this.directionNum={
        left:{
            x:-1,
            y:0
        },
        right:{
            x:1,
            y:0
        },
        down:{
            x:0,
            y:-1
        },
        up:{
            x:0,
            y:1
        }
    }
}
Snake.prototype.init=function(){
    //初始化
    var snakeHead = new Square(2,0,'snakehead'); 
    snakeHead.create();
    this.head=snakeHead;
    this.pos.push([2,0]);
    var snakeBody1 = new Square(1,0,'snakebody');
    snakeBody1.create();
    this.pos.push([1,0]);
    var snakeBody2 = new Square(1,0,'snakebody');
    snakeBody2.create();
    this.tail = snakeBody2;
    this.pos.push([0,0]);

    //将蛇身体，头形成链表关系
    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;

    this.direction = this.directionNum.right; 
}
//下面的方法用于获取蛇头下一位置对应元素，并根据这个元素执行不同的功能。
Snake.prototype.getnext = function(){
    var nextpos=[
        this.head.x/sw+this.direction.x,
        this.head.y/sh+this.direction.y
    ]
    //下面撞自己
    var gethitself = false;
    this.pos.forEach(function(value){
        if(value[0]==nextpos[0] && value[1]==nextpos[1]){
            gethitself = true;
        }
    })
    if(gethitself){
        this.nextstep.die.call(this);
        return;
    }
    //下面撞墙
    if(nextpos[0]<0 || nextpos[0]>td-1 || nextpos[1]<0 || nextpos[1]>tr-1){
        this.nextstep.die.call(this);
        return;
    }
    if(food && food.pos[0] == nextpos[0] && food.pos[1] == nextpos[1]){
        this.nextstep.eat.call(this);
        return;
    }
    this.nextstep.move.call(this);
    //利用call将move里面的this变成实例对象


}

Snake.prototype.nextstep={
    move:function(eaten){
        console.log("move");
        var newbody = new Square(this.head.x/sw, this.head.y/sh, "snakebody");
        //链表插入
        newbody.next=this.head.next;
        newbody.next.last=newbody;
        newbody.last=null; 
        this.head.remove();
        newbody.create();
        var newhead = new Square(this.head.x/sw+this.direction.x,
            this.head.y/sh+this.direction.y, "snakehead");
        newhead.next=newbody;
        newhead.last=null;
        newbody.next=newhead;
        newhead.create();
        //蛇身上每一个方块也要更新
        this.pos.splice(0,0,[this.head.x/sw+this.direction.x,
            this.head.y/sh+this.direction.y])
        this.head = newhead;
        if(!eaten){
            this.tail.remove();
            this.tail=this.tail.last;
            this.pos.pop();//pop将最后一个数据删掉
        } 
    },
    eat:function(){
        this.nextstep.move.call(this, true);
        creatfood();
        game.score++;
        game.showscore();
    },
    die:function(){
        game.over();
    }
}

snake = new Snake();
function creatfood(){
    var x=null;
    var y=null;
    // 但是食物不能出现蛇身上
    var include = true;
    while(include){
        x=Math.round(Math.random()*(td-1));//生成随机数公式
        y=Math.round(Math.random()*(tr-1));
        snake.pos.forEach(function(value){
            if(value[0]!=x && value[1]!=y){
                include=false;
            }
        })
    }
    food = new Square(x,y,"food");
    food.pos=[x,y];

    var fooddom=document.querySelector(".food");
    //下面判断页面中是否已经存在食物，如果已经有了则只刷新坐标。
    if(fooddom){
        fooddom.style.left=x*sw+'px';
        fooddom.style.top=y*sh+'px';
    }
    else{
        food.create();
    }
}

//下面是具体的游戏操作逻辑
function Game(){
    this.timer=null;
    this.score=0;
}

Game.prototype.init=function(){
    snake.init();
    snake.getnext();
    creatfood();
    //下面是键位控制
    document.onkeydown=function(ev){
        if(ev.which==37 && snake.direction!=snake.directionNum.right){
            snake.direction=snake.directionNum.left;
        }
        else if(ev.which==38 && snake.direction!=snake.directionNum.up){
            snake.direction=snake.directionNum.down;
        }
        else if(ev.which==39 && snake.direction!=snake.directionNum.left){
            snake.direction=snake.directionNum.right;
        }
        else if(ev.which==40 && snake.direction!=snake.directionNum.down){
            snake.direction=snake.directionNum.up;
        }
    }
    this.start();
    this.showscore();
}
Game.prototype.start=function(){
    this.timer = setInterval(function(){
        snake.getnext();
    },100)
}
Game.prototype.pause=function(){
    clearInterval(this.timer);
}
Game.prototype.showscore=function(){
    var d = document.getElementById("scorenum");
    d.innerHTML = this.score;
}
//游戏结束的方法
Game.prototype.over=function(){
    clearInterval(this.timer);
    alert("你的得分为："+this.score);
    //初始化游戏
    var snakewrap=document.getElementById("snakewrap");
    snakewrap.innerHTML='';
    snake = new Snake();//这个方法是非常方便的
    game = new Game();
    
    var startbtnre = document.querySelector(".startbtn")
    startbtnre.style.display = "block";
}
//设置游戏的开始
game = new Game();
var startbtn=document.querySelector('.startbtn button');//按类寻找
startbtn.onclick=function(){
    startbtn.parentNode.style.display='none';//找到startbtn的父级，然后使其被按后不显示
    game.init();
}
//暂停
var pausebtn=document.querySelector('.pausebtn');
snakewrap.onclick=function(){
    game.pause();
    pausebtn.style.display = 'block';
}
pausebtn.onclick=function(){
    game.start();
    pausebtn.style.display = 'none';
}
//下面是表单部分
var loginbutton = document.querySelector(".login");
var loginform = document.querySelector(".loginform");
var timer2;
loginbutton.onmouseover = function(){
    loginform.style.display = "block";
}
loginbutton.onmouseout = function(){
    timer2 = setTimeout(function(){
        loginform.style.display = "none";
    },20);
}
loginform.onmouseout = function(){
    timer2 = setTimeout(function(){
        loginform.style.display = "none";
    },20);
}
loginform.onmouseover = function(){
    if(timer2){
        clearTimeout(timer2);
    }
}






