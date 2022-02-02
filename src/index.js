var $ = require( "jquery" );
import './style.css';
import { words } from './assets/words.js'

let started = false
let round;
let roundWord;
let chosenWord;
let won = true;

/*
* Build the playing field
*/
function buildGrid()
{
    let row = {}
    for (var i = 0; i < 5; i++) {
        let inputs = ''
        for (var x = 0; x < 5; x++) {
            inputs += '<input disabled data-input="'+x+'" maxlength="1" class="w-20 h-20 rounded border-gray-500 text-5xl text-center border ml-2 mt-4" name="input_'+x+'" name="input_'+x+'" type="text">'
        }

        row[i] = $('<div class="flex flex-row" id="row_'+i+'">' +
            inputs +
            '</div>'
            );
        $('body').append(row[i])
    }
}

/*
* Create a random int between 2 integers to radomize the wordt that is used
*/
function randomIntFromInterval(min, max)
{
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/*
* Get random word from /assets/words.js
*/
function generateWord()
{
    let word = words[randomIntFromInterval(0, words.length)]
    // $('.current-word').text(word)
    return word.toLowerCase()
}

function guessWord(round)
{
    if(chosenWord === roundWord) {
        won = true
        $('#row_'+round+' input').css('background', 'red')
        $('input').attr('disabled', true)
        $('.win-message').text('you won!')
        roundWord = ''
        chosenWord = ''
        round = 0
        started = false
        $('.start-game').attr('disabled', false)
    } else {
        $('#row_'+round+' input').each(function(index, el) {
            if($(el).val() === chosenWord[index]) {
                $(el).css('background', 'red')
            } else if(chosenWord.indexOf($(el).val()) > -1) {
                $(el).css('background', 'yellow')
            }
        })

        progressGame(round + 1)
    }
}

function progressGame(round)
{
    if(round === 0) {
        $('input').each(function(index, el) {
            $(el).val('')
            $(el).css('background', '')
        })
        chosenWord = generateWord();
        $('.start-game').prop('disabled', started)
    }

    roundWord = ''
    started = true
    round = round

    $('#row_'+round+' input').each(function(index, el) {
        $(el).prop('disabled', false)
        if(index === 0) {
            $(el).focus()
        }
        $(el).on('keyup', (e) => {
            if($(e.target).val()) {
                roundWord += $(e.target).val()
                let currentId = parseInt($(e.target).attr('data-input'))
                if(currentId < 4) {
                    let nextId = currentId + 1
                    $(e.target).prop('disabled', true)
                    $('#row_'+round+' input[name=input_' + nextId+']').focus();
                } else {
                    $(e.target).prop('disabled', true)
                    guessWord(round)
                }
            }
        })
    })
}

function addEvents()
{
    $('.start-game').on('click', () => progressGame(0))
}

/*
* Initial start of the application
*/
function init()
{
    $('.game-state').text('Stopped')
    buildGrid();
    addEvents();
}

$(document).ready(function() {
  init()
})
