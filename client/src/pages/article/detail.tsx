import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text , Button, RichText} from '@tarojs/components';

// import ParseWxml from '../../components/parse-wxml/index'

import './detail.scss'

type ArticleDetailProp = {
  link: string
  type: string
}

export default class ArticleDetail extends Component<ArticleDetailProp> {

  state = {
    html: `<div class="rich-text">
    <table cellspacing="0" cellpadding="0"><tbody><tr><td class="t_f" id="postmessage_34099540">
<div class="dnch_eo_pr" style="margin-left:10px;width:auto"><div id="loadad3"></div>

</div><font face="微软雅黑"><font size="4">制作单文件软件很好用的工具，新版的搬运来给大家，压缩包里又x86和x64两个版本，希望有人能用得上</font></font><br>
<br>
<font color="#000"><font style="background-color:rgb(255, 255, 255)"><font size="4"><font face="微软雅黑">一个小巧强大的单文件制作工具，极大简化制作单文件的步骤，支持PECMD内核7zSFX内核自解压模块打包，创建的单文件体积小，支持传递参数、文件防修改、打包解压加密、打包运行时无需额外PECMD.exe</font></font></font></font><br>
<font color="#000"><font style="background-color:rgb(255, 255, 255)"><font size="4"><font face="微软雅黑"><br>
</font></font></font></font><br>
<font style="background-color:rgb(255, 255, 255)"><font face="微软雅黑"><font size="4"><font color="#000000">蓝奏云下载:<a rel="nofollow noopener" href="https://www.lanzoux.com/iBWv1gjko2b" target="_blank">https://www.lanzoux.com/iBWv1gjko2b</a> 密码:bo3p</font></font></font></font><br>
<font style="background-color:rgb(255, 255, 255)"><font face="微软雅黑"><font size="4"><font color="#000000"><br>
</font></font></font></font></td></tr></tbody></table>
<div class="pattl">



<dl class="tattl attm">
<dt></dt>
<dd>

<p class="mbn">
<a href="forum.php?mod=attachment&amp;aid=MjA3Mjc5NHw3YWIzMThkZnwxNTk5ODQzMjgyfDU3NTg4NnwxMjY1NjQ2&amp;nothumb=yes" onmouseover="showMenu({'ctrlid':this.id,'pos':'12'})" id="aid2072794" class="xw1" target="_blank">单文件制作工具.png</a>
<em class="xg1">(47.6 KB, 下载次数: 0)</em>
</p>
<div class="tip tip_4" id="aid2072794_menu" style="display: none" disautofocus="true">
<div>
<p>
<a href="forum.php?mod=attachment&amp;aid=MjA3Mjc5NHw3YWIzMThkZnwxNTk5ODQzMjgyfDU3NTg4NnwxMjY1NjQ2&amp;nothumb=yes" target="_blank">下载附件</a>

&nbsp;<a href="javascript:;" onclick="showWindow(this.id, this.getAttribute('url'), 'get', 0);" id="savephoto_2072794" url="home.php?mod=spacecp&amp;ac=album&amp;op=saveforumphoto&amp;aid=2072794&amp;handlekey=savephoto_2072794">保存到相册</a>

</p>
<p>
<span class="y">2020-9-12 00:26 上传</span>
<a href="javascript:;" onclick="imageRotate('aimg_2072794', 1)"><img src="https://static.52pojie.cn/static/image/common/rleft.gif" class="vm"></a>
<a href="javascript:;" onclick="imageRotate('aimg_2072794', 2)"><img src="https://static.52pojie.cn/static/image/common/rright.gif" class="vm"></a>
</p>
</div>
<div class="tip_horn"></div>
</div>
<p class="mbn">

</p>



<div class="mbn savephotop">

<img id="aimg_2072794" aid="2072794" src="https://attach.52pojie.cn/forum/202009/12/002600za3jfk3kfkcjzoll.png" zoomfile="https://attach.52pojie.cn/forum/202009/12/002600za3jfk3kfkcjzoll.png" file="https://attach.52pojie.cn/forum/202009/12/002600za3jfk3kfkcjzoll.png" class="zoom" onclick="zoom(this, this.src, 0, 0, 0)" alt="单文件制作工具.png" title="单文件制作工具.png" w="561" lazyloaded="true" height="576">

</div>

</dd>
</dl>

</div>
</div>`
  }
  
  componentDidMount() {
    console.log(getCurrentInstance().router?.params.link);
  }
  render() {
    const { html } = this.state
    return (
      <View className='article-detail'>
        <RichText className='article-detail-body' nodes={html}></RichText>
      </View>
    );
  }
}