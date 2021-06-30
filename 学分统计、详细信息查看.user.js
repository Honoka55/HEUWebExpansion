// ==UserScript==
// @name         学分统计、详细信息查看
// @namespace    http://www.yushao.xyz/
// @version      1.1
// @description  try to take over the world!
// @author       Yusho
// @match        *://*.hrbeu.edu.cn/*/cjcx_list
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @require      https://cdn.jsdelivr.net/npm/heyui
// @resource css https://cdn.jsdelivr.net/npm/heyui/themes/index.css

// ==/UserScript==

// 配置区域
unsafeWindow.Show = function(data){
	var i = 0
    console.log(data)
	var datas = []

    //模板
    var showtemplate = [
        ["总学分",164,data.XueFen.ALL],
	]

	app.datas = showtemplate
	app.notice()
}



GM_addStyle(GM_getResourceText("css"));
var root = '<div id="app" style="margin-buttom:10px margin-top:10px">'
root += '<p><font color = "green">统计将会显示在这里</font></p>'
root += '<h-circle style="margin-right:10px margin-top:10px" v-for="one in datas" :percent="one[2]/one[1] * 100" :stroke-width="12" :size="100">'
//root += '{{one[0]}}'
root += '<p class="gray-color"><span v-font="3">{{one[0]}}</span></p>'
root += '<p class="gray-color"><span class="primary-color" v-font="3">{{one[2]}}</span><span v-font="3">/{{one[1]}}</span></p>'
root += '</h-circle></div>'
$("#dataList").before(root)
unsafeWindow.app = new Vue({
	el: '#app',
	data: {
		datas: [["统计信息",1,1]],

	},methods:{
		notice(){
			this.$Notice['info']("进度已经加载完毕")
		}
	}
})

unsafeWindow.JsMod = function (htmlurl,tmpWidth,tmpHeight){
	htmlurl=getRandomUrl(htmlurl);
    htmlurl = "http://edusys.hrbeu.edu.cn" + htmlurl
    var root = ""
    root += `<iframe src = ${htmlurl} height = "100%" width = "100%" style="border: medium none;"></iframe>`
    app.$Modal({
        title:"成绩细则",
        content:root,
        width:tmpWidth,
        buttons: [{
          type: 'cancel',
          name: '关闭'
        }],
        hasDivider:true
    })
}

unsafeWindow.getSUM = function(data,key){
	var i = 0
	var sum = 0
    if(!key){key = "XueFen"}
	for(i = 0;i < data.length;i++){
		sum += parseFloat(data[i][key])
	}
	return sum
}

unsafeWindow.getData = function (){
    var courseName = $('#dataList tbody tr td:nth-child(4)')
    var courseG = $('#dataList tbody tr td:nth-child(5)') //成绩
    var courseXueFen = $('#dataList tbody tr td:nth-child(6)') //学分
    var courseType = $('#dataList tbody tr td:nth-child(11)')
    var courseSubType = $('#dataList tbody tr td:nth-child(12)')
	var courseMust = $('#dataList tbody tr td:nth-child(10)')
    var alldata = []
    var data = {}
    for (var i = 0; i < courseG.length; i++) {
		data["name"] = courseName[i].textContent
		data["ChengJi"] = courseG[i].textContent
		data["XueFen"] = courseXueFen[i].textContent
		data["Type"] = courseType[i].textContent
		data["subT"] = courseSubType[i].textContent
		data["Must"] = courseMust[i].textContent
		alldata.push(data)
		data = {}
	}
	return alldata
}

unsafeWindow.coverString = function (subStr,str) {
	var reg = eval("/"+subStr+"/ig");
	return reg.test(str);
}

unsafeWindow.analize = function(data){
	var daleijiaoyu = []
	var tongshibixiu = []
	var zhuanyehexinke = []
	var zhuanyexuanxiuke = []
	var A = []
	var G = []
	var B = []
	var C = []
	var D = []
	var E = []
	var F = []

	var i = 0
	var res = {XueFen:{}}
	res.XueFen.ALL= getSUM(data)
	res.XueFen.Must= 0
    // ##### 不及格的项目还未统计
	for(i = 0; i< data.length;i++){
		//分类
		if(coverString("必修",data[i].Must)){
			res.XueFen.Must += parseFloat(data[i].XueFen)
		}
		if(coverString("大类教育",data[i].Type)){
			daleijiaoyu.push(data[i])
		}else if(coverString("通识教育",data[i].Type)){
			tongshibixiu.push(data[i])
		}else if(coverString("A",data[i].Type)){
			A.push(data[i])
		}else if(coverString("B",data[i].Type)){
			B.push(data[i])
		}else if(coverString("C",data[i].Type)){
			C.push(data[i])
		}else if(coverString("D",data[i].Type)){
			D.push(data[i])
		}else if(coverString("E",data[i].Type)){
			E.push(data[i])
		}else if(coverString("F",data[i].Type)){
			F.push(data[i])
		}else if(coverString("G",data[i].Type)){
			G.push(data[i])
		}else if(coverString("专业选修",data[i].Type)){
			zhuanyexuanxiuke.push(data[i])
		}else if(coverString("专业核心",data[i].Type)){
			zhuanyehexinke.push(data[i])
		}
	}
	res = {
			A:A,
			G:G,
			B:B,
			C:C,
			D:D,
			E:E,
			F:F,
			XueFen:{
				Must:res.XueFen.Must,
				ALL:res.XueFen.ALL,
                A:getSUM(A),
                B:getSUM(B),
                C:getSUM(C),
                D:getSUM(D),
                E:getSUM(E),
                F:getSUM(F),
                G:getSUM(G)
			},
		}
	for(i = 0; i< data.length;i++){
		if(!res.XueFen[data[i].Type]){
			res.XueFen[data[i].Type] = 0
            res[data[i].Type] = []
		}
		res.XueFen[data[i].Type] += parseFloat((data[i].XueFen))
        res[data[i].Type].push(data[i])
	}
	res.XueFen["TongShi"] = getSUM(A) + getSUM(B) + getSUM(C) + getSUM(D) + getSUM(E) + getSUM(F) + getSUM(G)
	return res
}


Show(analize(getData()))
