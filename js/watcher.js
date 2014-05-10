

    var fps = 30;
var quality = 100;
var timeout = 33;
var baseURL = ""; //change this to "http://_yawcam_computer_address:port/" when running on own server.
var t_;
var i_;
var ct_;
var id;
var xmlHttp;
var firstReq=true;
var state = "null";

function updateID()
{
    id = Math.random();
}

function setFps(val)
{
    fps = val;
    timeout = Math.round(1000.0/fps);
}

function setQ(val)
{
    quality = 100;
}

function scaleIn()
{
    document.images.camImg.width = document.images.camImg.width + 40;
    document.images.camImg.height = document.images.camImg.height + 30;
}

function scaleOut()
{
    document.images.camImg.width = document.images.camImg.width - 40;
    document.images.camImg.height = document.images.camImg.height - 30;
}

function scaleOrg()
{
    document.images.camImg.width = @WIDTH;
    document.images.camImg.height = @HEIGHT;
}

function showLayer(theLayer)
{
    getLayer(theLayer).style.display = "block";
}

function hideLayer(theLayer)
{
    getLayer(theLayer).style.display = "none";
}

function hideAllMenuLayers()
{
    hideLayer('menu_fps');
    hideLayer('menu_fps_child');
    hideLayer('menu_quality');
    hideLayer('menu_quality_child');
    hideLayer('menu_scale');
    hideLayer('menu_scale_child');
    @SOUND_OPTION
    hideLayer('menu_sound');
    hideLayer('menu_sound_child');
    @SOUND_OPTION
    hideLayer('menu_about');
    hideLayer('menu_about_child');
}

function hideAllMenuChildren()
{
    hideLayer('menu_fps_child');
    hideLayer('menu_quality_child');
    hideLayer('menu_scale_child');
    @SOUND_OPTION
    hideLayer('menu_sound_child');
    @SOUND_OPTION
    hideLayer('menu_about_child');
}

function showAllMenuCols()
{
    showLayer('menu_fps');
    showLayer('menu_quality');
    showLayer('menu_scale');
    @SOUND_OPTION
    showLayer('menu_sound');
    @SOUND_OPTION
    showLayer('menu_about');
}

function fixMenuColPos(owner)
{
    var i=0;
    setLyr(owner,'menu_fps',false,i++);
    setLyr(owner,'menu_quality',false,i++);
    setLyr(owner,'menu_scale',false,i++);
    @SOUND_OPTION
    setLyr(owner,'menu_sound',false,i++);
    @SOUND_OPTION
    setLyr(owner,'menu_about',false,i++);
}

function getLayer(theLayer)
{
    var obj = null;
    if (document.getElementById)
    {
        obj = document.getElementById(theLayer);
    }
    else if (document.all)
    {
        obj = document.all[theLayer];
    }
    else if (document.layers)
    {
        obj = document.layers[theLayer];
    }
    return obj;
}

function getMarker(val,testVal)
{
    var str = null;
    if(val == testVal)
    {
        str = "<img src=\"img/mrk.gif\" style=\"border:none;vertical-align: text-bottom;margin: 0px;\" alt=\"<--\">";
    }
    else
    {
        str = "";
    }
    return str;
}

function showErrorImage()
{
    clearTimeout(t_);
    clearInterval(i_);
    document.images.camImg.onload = "";
    document.images.camImg.src = "http://www.yawcam.com/offline.jpg";
    window.status = "Webcam offline";
}

function showStatusImage(imgUrl)
{
    clearTimeout(t_);
    clearInterval(i_);
    document.images.camImg.onload = "";
    document.images.camImg.src = imgUrl;
}

function reloadImage()
{
    var theDate = new Date();
    var url = baseURL + "out.jpg?";
    url += ("q="+quality);
    url += ("&id="+id);
    url += "&r=";
    url += theDate.getTime().toString();
    document.images.camImg.src = url;
    window.status = "Yawcam streaming...";
}

function fixImageTimeout()
{
    t_ = setTimeout("reloadImage();",timeout);
}

function cTO()
{
    if(state=="running")
    {
        clearTimeout(t_);
        reloadImage();
    }
}

function updateFpsMenu()
{
    document.getElementById('fps_30').innerHTML = "30 " + getMarker(fps,30);
    document.getElementById('fps_15').innerHTML = "15 " + getMarker(fps,15);
    document.getElementById('fps_10').innerHTML = "10 " + getMarker(fps,10);
    document.getElementById('fps_5').innerHTML = "5 " + getMarker(fps,5);
    document.getElementById('fps_1').innerHTML = "1 " + getMarker(fps,1);
}

function updateQualityMenu()
{
    document.getElementById('q_75').innerHTML = "75 % " + getMarker(quality,75);
    document.getElementById('q_50').innerHTML = "50 % " + getMarker(quality,50);
    document.getElementById('q_40').innerHTML = "40 % " + getMarker(quality,40);
    document.getElementById('q_30').innerHTML = "30 % " + getMarker(quality,30);
    document.getElementById('q_20').innerHTML = "20 % " + getMarker(quality,20);
    document.getElementById('q_10').innerHTML = "10 % " + getMarker(quality,10);
    document.getElementById('q_5').innerHTML = "5 % " + getMarker(quality,5);
    document.getElementById('q_1').innerHTML = "1 % " + getMarker(quality,1);
}

function setLyr(obj,lyr,drop,col)
{
    var coors = findPos(obj);
    var x = document.getElementById(lyr);
    if(drop == true)
    {
        coors[1] = coors[1]+26;
    }
    x.style.top = coors[1] + 'px';
    coors[0] = coors[0]+(col*80);
    x.style.left = coors[0] + 'px';
}

function findPos(obj)
{
    var curleft = curtop = 0;
    if (obj.offsetParent)
    {
        curleft = obj.offsetLeft
        curtop = obj.offsetTop
        while (obj = obj.offsetParent)
        {
            curleft += obj.offsetLeft
            curtop += obj.offsetTop
        }
    }
    return [curleft,curtop];
}

function startPoll()
{
    document.images.camImg.onload=fixImageTimeout
    fixConnectTimeout();
    getStatus();
}

function fixStatusTimeout()
{
    ts_ = setTimeout("getStatus();",2000);
}

function fixConnectTimeout()
{
    ct_ = setTimeout("showErrorImage();",45000);
}

function getStatus()
{
    xmlHttp=GetXmlHttpObject()
    if(xmlHttp==null)
    {
        alert("Browser does not support HTTP Request")
        return
    }
    var url=baseURL+"get?id="+id+"&r="+Math.random()
    xmlHttp.onreadystatechange=stateChanged
    xmlHttp.open("GET",url,true)
    xmlHttp.send(null)
}

function sendPass()
{
    xmlHttp=GetXmlHttpObject()
    if(xmlHttp==null)
    {
        alert("Browser does not support HTTP Request")
        return
    }
    var user = document.getElementById('user').value;
    var pass = document.getElementById('pass').value;
    var url=baseURL+"get?id="+id+"&u="+user+"&p="+pass+"&r="+Math.random()
    xmlHttp.onreadystatechange=stateChanged
    xmlHttp.open("GET",url,true)
    xmlHttp.send(null)
}

function playSound(file)
{

    var selection=document.adevform.adev;
    var target=0;
    if (selection) {
        for (var i = 0; i < selection.length; ++i) {
            if (selection[i].checked==true)
                target=i;
        }
    }

    xmlHttp=GetXmlHttpObject()
    if(xmlHttp==null)
    {
        alert("Browser does not support HTTP Request")
        return
    }
    var url=baseURL+"playsound?file="+file+"&target="+target+"&r="+Math.random()
    xmlHttp.onreadystatechange=stateChanged
    xmlHttp.open("GET",url,true)
    xmlHttp.send(null)
}

function stateChanged()
{
    if(xmlHttp.readyState==4 || xmlHttp.readyState=="complete")
    {
        if(xmlHttp.status==200)
        {
            if(xmlHttp.responseText=="ok")
            {
                if(firstReq)
                {
                    i_ = setInterval("getStatus();",2000);
                    clearTimeout(ct_);
                    hideLayer('passLyr');
                    firstReq=false;
                    state="running";
                    document.images.camImg.onload=fixImageTimeout
                    reloadImage();
                }
            }
            else if(xmlHttp.responseText=="2many")
            {
                clearTimeout(ct_);
                state="2many";
                showStatusImage("img/toomany.jpg");
                window.status = "Try later...";
            }
            else if(xmlHttp.responseText=="banned")
            {
                clearTimeout(ct_);
                state="banned";
                showStatusImage("img/banned.jpg");
                window.status = "You are banned.";
            }
            else if(xmlHttp.responseText=="dataLimit")
            {
                state="datalimit";
                showStatusImage("img/datalimit.jpg");
                window.status = "You hit data limit.";
            }
            else if(xmlHttp.responseText=="timeLimit")
            {
                state="timelimit";
                showStatusImage("img/timelimit.jpg");
                window.status = "You hit time limit.";
            }
            else if(xmlHttp.responseText=="kicked")
            {
                state="kicked";
                showStatusImage("img/kicked.jpg");
                window.status = "You are kicked.";
            }
            else if(xmlHttp.responseText=="passErr")
            {
                state="passErr";
                document.getElementById('passHeading').innerHTML = '<font color="#FF0000">Login Error!</font>';
                window.status = "Login Error!";
            }
            else if(xmlHttp.responseText=="pass")
            {
                clearTimeout(ct_);
                state="pass";
                showStatusImage("img/pass.jpg");
                setLyr(document.getElementById('camImg'),'passLyr',false,0);
                showLayer('passLyr');
            }
            else if(xmlHttp.responseText=="playing sound")
            {
                /* Do nothing */
            }
            else if(xmlHttp.responseText=="playing sound failed")
            {
                alert("Failed to play sound!");
            }
            else
            {
                state="error";
                showErrorImage();
                window.status = "Error...";
                alert("Unknown response: "+xmlHttp.responseText);
            }
        }
        else if (xmlHttp.status==404)
        {
            //alert("Got 404");
        }
    }
}

function GetXmlHttpObject()
{
    var XMLHttp_=null
    try
    {
        XMLHttp_=new ActiveXObject("Msxml2.XMLHTTP")
    }
    catch(e)
    {
        try
        {
            XMLHttp_=new ActiveXObject("Microsoft.XMLHTTP")
        }catch(e){}
    }

    if (XMLHttp_==null)
    {
        XMLHttp_=new XMLHttpRequest()
    }

    return XMLHttp_;
}


