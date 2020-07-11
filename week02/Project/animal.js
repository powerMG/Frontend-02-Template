/**
 * 动物
 * > 种类
 * >> 特征
 * >> 抽象特征
 * >> 私有特征
 * > 行为
 * >> 抽象行为
 * >> 私有行为
 */
class Animal {
    constructor() {
        // 腿，眼，嘴，鼻子，耳朵（抽象特征）
        [this.leg, this.eye, this.mouth, this.nose, this.ears] = [4, 2, 1, 1, 2];
    }
    /**
     * 抽象行为
     * 都具备咬（bite）、吃（eat）、跑（run）的行为
     */
    bite(className, target) {
        return `${className}在咬${target}，很顽皮！！！`
    }
    eat(className, target) {
        return `${className}在吃${target}，吃的很开心！！！`
    }
    run(className) {
        return `${className}在拼命奔跑！！！`
    }
}
// 狗
class Dog extends Animal {
    constructor() {
        super()
        /**
         * 私有特征
         */
        // 体型
        this.shape = "有大有小";
        // 类别
        this.type = "包含大中小三类家宠"
    }
    /**
     * 私有行为：
     * 刨土（plough）、摇尾巴（shak）
     */
    plough() {
        return `一只天气一热就喜欢在院子里抛土的小狗！！！`
    }
    shak() {
        return `一只见到主人就喜欢疯狂摇尾巴的小狗！！！`
    }
}
// 猫
class Cat extends Animal {
    constructor() {
        super()
        /**
         * 私有特征
         */
        // 体型
        this.shape = "微小";
        // 类别
        this.type = "小型家宠"
    }
    /**
    * 私有行为：
    * 挠（scratch）
    */
    scratch() {
        return `一只见到陌生人就喜欢（挠人）的猫！！！`
    }
}
// 老鼠
class Mouse extends Animal {
    constructor() {
        super()
        /**
         * 私有特征
         */
        // 体型
        this.shape = "渺小";
        // 类别
        this.type = "自然生长"
    }
    /**
    * 私有行为：
    * 磨牙（molar）
    */
    molar() {
        return `一只非常喜欢磨牙的老鼠！！！`
    }
}
/**
* 猫
* 咬人\吃猫粮\奔跑\挠陌生人
*/
function catClass() {
    let _cat = new Cat();
    let _className = "乳白色瞎猫咪"
    // 猫咬人
    console.log(_cat.bite(_className, "自己的主人"));
    // 吃猫粮
    console.log(_cat.eat(_className, "猫粮"));
    // 奔跑
    console.log(_cat.run(_className));
    // 挠陌生人
    console.log(_cat.scratch());
}
catClass();
/**
* 狗
* 咬人\吃狗粮\奔跑\刨土\摇尾巴
*/
function dogClass() {
    let _dog = new Dog();
    let _className = "小柯基点点";
    console.log(_dog.bite(_className, "自己的主人"));
    // 吃狗粮
    console.log(_dog.eat(_className, "狗粮"));
    // 奔跑
    console.log(_dog.run(_className));
    // 刨土
    console.log(_dog.plough());
    // 刨土
    console.log(_dog.shak());
}
dogClass();
/**
* 老鼠
* 咬人\吃玉米\奔跑\磨牙
*/
function mouseClass() {
    let _mouse = new Mouse();
    let _className = "小老鼠贝塔";
    console.log(_mouse.bite(_className, "自己的主人"));
    // 吃狗粮
    console.log(_mouse.eat(_className, "玉米"));
    // 奔跑
    console.log(_mouse.run(_className));
    // 磨牙
    console.log(_mouse.molar());
}
mouseClass();
