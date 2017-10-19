var infoList = [
    {'key': 'arrive', 'title': '感恩回店礼', 'info': '<p>1.试驾RAV4、CROWN即有机会抽取豪华邮轮之旅</p><p>2.全场购车至高3年0利息，首付30%起</p><p>3.购买RAV4荣放即享40%首付24期0利息</p><p>4.购买普拉多2.7L即享50%首付24期0利息，30%首付36期低利息</p><p>5.更多一汽丰田购车金融政策详情请咨询当地经销店</p>'},
    {'key': '10yuan', 'title': '10元话费礼', 'info': '<p>1.一汽丰田车主输入姓名、手机号，长按专属二维码完成认证，即可获得10元话费。</p><p>2.车主认证成功后10元话费将在一周内发放。</p>'},
    {'key': 'plan', 'title': '安享计划礼', 'info': '<p>1.首年续保赠延保（对象AAA保险）</p><p>2.非首年续保赠机油（对象AAA保险）</p><p>3.购延保产品赠机油（对象AAA保险）</p><p>4.老客户置换额外再享2000元优惠</p>'},
    {'key': 'lucky', 'title': '幸运抽奖礼', 'info': '<p>1.一汽丰田车主完成认证才有资格抽奖。</p><p>2.用户中奖后会在30个工作日内完成奖品发放。</p><p>3.京东卡和腾讯视频会员奖品会通过短信电子兑换码形式发放给中奖车主。</p><p>4.加油卡和车载净化器奖品需填写正确的收件人、联系电话及发货地址，因信息不全或错误造成礼品无法快递的，取消中奖资格。</p><p>5.中奖车主需保证留资电话准确无误，因电话错误造成无法联系或中奖电子码无法发送，取消中奖资格。</p><p>6.每个认证车主每天有3次抽奖机会，中奖奖品不可转让、不可买卖。</p>'},
];
var codeInfoList = [
    {'tip1':'终于等到你','tip2':'还好最终团聚','codeImg': 'images/codeA.jpg'},
    {'tip1':'WE ARE', 'tip2':'伐木累','codeImg': 'images/codeB.jpg'},
    {'tip1':'我们手牵手', 'tip2':'再也不分开','codeImg': 'images/codeC.jpg'}
];
var $actDialog = $('#actDetailDialog');
var interval = -1;
var curIndex = 0;
var pageIndex = 0;
var pageSlider;

function bindClicks() {
    $('.close').click(function () {
        startMarquee();
        $actDialog.hide();
    });

    $('.itemHover').click(function () {
        stopMarquee();
        $actDialog.find('.title').html(infoList[curIndex].title);
        $actDialog.find('.info').html(infoList[curIndex].info);
        $actDialog.show();
    });

    $('.btnAuth').click(function () {
        pageSlider.next();
    });

    $('#btnGetCode').click(function () {
        alert("获取验证码");
    });

    $('#3dCanvas').click(function () {
        pageSlider.next();
    });

    var resultIndex = 1;
    $('#btnSubmit').click(function () {
        // 获取结果 并设置结果展示内容
        var info = codeInfoList[resultIndex];
        console.log(info);
        $('.tip1').html(info.tip1);
        $('.tip2').html(info.tip2);
        $('.codeImg').attr('src', info.codeImg);
        // 切屏
        pageSlider.next();
    });
}

function updateActInfo(index) {
    var item = [index % 4, (index+1)  % 4,(index+2) % 4,(index+3) % 4];
    $('.itemHover').css('background-position-x', item[0] * 33 + '%');
    $('.itemRight').css('background-position-x', item[1] * 33 + '%');
    $('.itemMid').css('background-position-x', item[2] * 33 + '%');
    $('.itemLeft').css('background-position-x', item[3] * 33 + '%');
}

function startMarquee() {
    if (interval == -1) {
        // 跑马灯效果
        interval = setInterval(function () {
            if (curIndex == 3) {
                curIndex = 0
            } else  {
                curIndex ++;
            }
            updateActInfo(curIndex);
        }, 2000);
    }
}
function stopMarquee() {
    clearInterval(interval);
    interval = -1;
}

$(document).ready(function(e){
	//横屏提示
	new WxMoment.OrientationTip();

	// 统计分析
    // var wa = new WxMoment.Analytics({
    //     projectName: "20150504WXMOMENT"
    // });

    pageSlider = new WxMoment.PageSlider({
        pages: $('.screen'),
        direction: 'vertical',          //可选，vertical 或 v 为上下滑动，horizontal 或 h 为左右滑动，默认为 vertical
        currentClass: 'current',        //可选, 当前屏的class (方便实现内容的进场动画)，默认值为 'current'
        rememberLastVisited: true,      //可选，记住上一次访问结束后的索引值，可用于实现页面返回后是否回到上次访问的页面
        animationPlayOnce: false,       //可选，切换页面时，动画只执行一次
        oninit: function () {},         //可选，初始化完成时的回调
        onbeforechange: function () {}, //可选，开始切换前的回调
        onchange: function () {
            pageIndex = this.index;
        },       //可选，每一屏切换完成时的回调
        onSwipeUp: function () {},      //可选，swipeUp 回调
        onSwipeDown: function () {},    //可选，swipeDown 回调
        onSwipeLeft: function () {},    //可选，swipeLeft 回调
        onSwipeRight: function () {}    //可选，swipeRight 回调
    });

	loadPage2();
	bindClicks();
	updateActInfo(curIndex);
    startMarquee();

});