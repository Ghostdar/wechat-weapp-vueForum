var CONST=require('const.js')
var API = {
  Get_topics:'/topics', // 主题首页
  Get_topics_detail: '/topic/', // 主题详情
  Get_user: '/user/', // 用户详情
  Get_message_count: '/message/count', // 获取未读消息数
  Get_messages: '/messages', // 获取已读和未读消息
  Post_topic: '/topics', // 新建主题
  Post_topic_collect: '/topic/collect', // 收藏主题
  Post_topic_de_collect: '/topic/de_collect', // 取消收藏
  Post_new_reply: '/topic/', // 新建评论
  Post_reply_ups: 'reply/:reply_id/ups', // 为评论点赞
  Post_access: '/accesstoken', // 验证accesstoken
  Post_mark_all: '/message/mark_all ', // 标记全部已读
}
for( var i in API){
    API[i] = CONST.CONST.RootUrl+API[i]
}
exports.API = API
