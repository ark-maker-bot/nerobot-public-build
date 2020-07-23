const discord = require('discord.js');
module.exports = {
    permCheck(message, member, perm){
        const guildMember = message.guild.member(member);
        if(!guildMember)return;
        if(guildMember.hasPermission(perm)){
            return true;
        }
        return false;
    }
};