
        // wenn Seite geladen wurde, dann schicke $ajax und lade Daten
        $.ajax({
            url: '/getmusiker',
            method: 'post',
            success: (musiker) => {
                alert('daten wurden geladen'); // schöner, besser

                for (let i in musiker) {
                    $('<p>').html(musiker[i].vorname + ' ' + musiker[i].nachname).appendTo('body');
                }


            }
        });
