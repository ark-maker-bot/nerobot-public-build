require('dotenv').config();
const discord = require('discord.js'),
    moment = require('moment');
const cheerio = require('cheerio');
const rp = require('request-promise');

const client = new discord.Client();

var maxAmountPost = 1;

module.exports.onReady = onReady;
module.exports.nsfwAutoPost = nsfwAutoPost;

async function onReady() {
    let hour = 60;
    let hourmil = hour * 60000;
    var base = process.env.BASEURL;
    var options = {
        uri: base,
        method: 'GET',
        resolveWithFullResponse: true
    };
    rp(options).then(function (response) {
        var $ = cheerio.load(response.body);
        var originIdElement = $('#text');
        if(!originIdElement)return;
        var idElement = $('p').text();
        if(!idElement)return;
        if(idElement.includes('Serving')){
           const args = idElement.split(/ +/);
           let newValue = args[1].replace(/,/g, "");
           maxAmountPost = parseInt(newValue, 10);
           console.log(maxAmountPost);
        }
        else {
           console.log('not found');
        }
    }).catch(function (err) {
        console.log(err);
    });

    setInterval( async () => {
        var base = process.env.BASEURL;
        var options = {
            uri: base,
            method: 'GET',
            resolveWithFullResponse: true
        };
        rp(options).then(function (response) {
            var $ = cheerio.load(response.body);
            var originIdElement = $('#text');
            if(!originIdElement)return;
            var idElement = $('p').text();
            if(!idElement)return;
            if(idElement.includes('Serving')){
               console.log('found');
               const args = idElement.split(/ +/);
               let newValue = args[1].replace(/,/g, "");
               maxAmountPost = parseInt(newValue, 10);
               console.log(maxAmountPost);
            }
            else {
               console.log('not found');
            }
        }).catch(function (err) {
            console.log(err);
        });
    }, hourmil);
}

async function nsfwAutoPost(){
    setInterval( async () => {
        var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256, 255];
        var imageId = parseInt(Math.random() * maxAmountPost);
        var base = process.env.IMAGEURL + imageId;
        var options = {
            uri: base,
            method: 'GET',
            resolveWithFullResponse: true,
            json: true
        };
        rp(options).then(function (response) {
            var $ = cheerio.load(response.body);
            var originIdElement = $('#image');
            if(!originIdElement)return;
            var notAVideo = $('#gelcomVideoPlayer').text();
            if(notAVideo)return;
            var scoreElement = $('div').find($('#stats')).text();
            if(!scoreElement)return;

            const args = scoreElement.split(/ +/);

            let newArg = "";
            for (var i = 0; i < args.length; i++){
                if(args[i].includes('\n')){
                    newArg += args[i].replace(/\n/g, " ");
                }else{
                    newArg += args[i] + ' ';
                }
            }

            let newArgs = newArg.split(/ +/);
            let score = '';
            let source = '';

            //console.log(newArgs);
            for (var j = 0; j < newArgs.length; j++){
                if(newArgs[j].includes('Score'))
                    score = newArgs[j];
            }
            var fullSrc = source.slice(7);
            let score2 = score.slice(6);
            let newScore = parseInt(score2, 10);
            var idElement = "";
            var element = $('#image').attr('data-cfsrc');
            if(!element)return;
            else idElement = element.toString();
            //console.log(idElement);
            if(idElement.includes('img.rule34.xxx') || idElement.includes('rule34.xxx//samples')){
                console.log('found');
                let baseAuthor = '🔞 Rule34';
                let baseTitle = '🔗 link to website';
                let baseFooter = '👍: ' + newScore;
                const NSFWEmbed = new discord.MessageEmbed()
                .setAuthor(baseAuthor)
                .setTitle(baseTitle)
                .setImage(idElement)
                .setURL(base)
                .setColor(rgb)
                .setFooter(baseFooter)
                .setTimestamp(moment().format());

                let localGuild = client.guilds.cache.find(guild => guild.id === '697177572920000693');
                if(!localGuild)return;
                let localChannel = localGuild.channels.cache.find(ch => ch.id === '738506267110408273');
                if(!localChannel)return;
                localChannel.send(NSFWEmbed);
            }
            else {
                console.log('not found');
            }
        }).catch(function (err) {
            console.log(err);
        });
    }, 10000);
}