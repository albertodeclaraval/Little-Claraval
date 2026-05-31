-- Lectionary: Week 22 Ordinary Time — Gospel readings from Luke
-- English: Douay-Rheims 1899 (public domain)
-- Weekday gospels are identical for Cycle I and Cycle II

-- ═══════════════════════════════════════════
-- SUNDAY YEAR C: Luke 14:1, 7-14
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('C', 'ordinary', 22, 0, '', 'en', 'Lk 14:1, 7-14',
'And it came to pass, when Jesus went into the house of one of the chief of the Pharisees, on the sabbath day, to eat bread, that they watched him.

And he spoke a parable also to them that were invited, marking how they chose the first seats at the table, saying to them: When thou art invited to a wedding, sit not down in the first place, lest perhaps one more honourable than thou be invited by him: And he that invited thee and him, come and say to thee, Give this man place: and then thou begin with shame to take the lowest place. But when thou art invited, go, sit down in the lowest place; that when he who invited thee, cometh, he may say to thee: Friend, go up higher. Then shalt thou have glory before them that sit at table with thee. Because every one that exalteth himself, shall be humbled; and he that humbleth himself, shall be exalted.

And he said also to him that had invited him: When thou makest a dinner or a supper, call not thy friends, nor thy brethren, nor thy kinsmen, nor thy neighbours who are rich; lest perhaps they also invite thee again, and a recompense be made to thee. But when thou makest a feast, call the poor, the maimed, the lame, and the blind; And thou shalt be blessed, because they have not wherewith to recompense thee: for recompense shall be made thee at the resurrection of the just.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('C', 'ordinary', 22, 0, '', 'es', 'Lc 14:1, 7-14',
'Un sábado Jesús fue a comer a casa de uno de los jefes de los fariseos, y ellos lo observaban.

Notando cómo los invitados escogían los primeros puestos, les propuso esta parábola: «Cuando alguien te invite a una boda, no te sientes en el lugar de honor, no sea que haya invitado a alguien más importante que tú, y el que los invitó a los dos venga a decirte: "Cédele el puesto a este señor." Entonces, lleno de vergüenza, tendrás que ir a ocupar el último lugar. Al contrario, cuando te inviten, ve a sentarte en el último lugar, para que cuando llegue el que te invitó, te diga: "Amigo, sube más arriba." Así serás honrado delante de todos los convidados. Porque todo el que se ensalza será humillado, y el que se humilla será ensalzado.»

Luego dijo al que le había invitado: «Cuando des un almuerzo o una cena, no invites a tus amigos, ni a tus hermanos, ni a tus parientes, ni a los vecinos ricos; porque ellos también te invitarán a su vez, y con eso quedarás pagado. Cuando des un banquete, invita a los pobres, a los lisiados, a los cojos, a los ciegos; y serás dichoso, porque ellos no tienen con qué pagarte, pero ya recibirás tu pago en la resurrección de los justos.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- MONDAY Week 22: Luke 4:16-30
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 1, '', 'en', 'Lk 4:16-30',
'And he came to Nazareth, where he was brought up: and he went into the synagogue, according to his custom, on the sabbath day; and he rose up to read. And the book of Isaias the prophet was delivered unto him. And as he unfolded the book, he found the place where it was written: The Spirit of the Lord is upon me. Wherefore he hath anointed me to preach the gospel to the poor, he hath sent me to heal the contrite of heart, To preach deliverance to the captives, and sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord, and the day of reward. And when he had folded the book, he restored it to the minister, and sat down. And the eyes of all in the synagogue were fixed on him. And he began to say to them: This day is fulfilled this scripture in your ears. And all gave testimony to him: and they wondered at the words of grace that proceeded from his mouth, and they said: Is not this the son of Joseph?

And he said to them: Doubtless you will say to me this similitude: Physician, heal thyself: as great things as we have heard done in Capharnaum, do also here in thy own country. And he said: Amen I say to you, that no prophet is accepted in his own country. In truth I say to you, there were many widows in the days of Elias in Israel, when heaven was shut up three years and six months, when there was a great famine throughout all the earth. And to none of them was Elias sent, but to Sarepta of Sidon, to a widow woman. And there were many lepers in Israel in the time of Eliseus the prophet: and none of them was cleansed but Naaman the Syrian.

And all they in the synagogue, hearing these things, were filled with anger. And they rose up and thrust him out of the city; and they brought him to the brow of the hill, whereon their city was built, that they might cast him down headlong. But he passing through the midst of them, went his way.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 1, '', 'en', 'Lk 4:16-30',
'And he came to Nazareth, where he was brought up: and he went into the synagogue, according to his custom, on the sabbath day; and he rose up to read. And the book of Isaias the prophet was delivered unto him. And as he unfolded the book, he found the place where it was written: The Spirit of the Lord is upon me. Wherefore he hath anointed me to preach the gospel to the poor, he hath sent me to heal the contrite of heart, To preach deliverance to the captives, and sight to the blind, to set at liberty them that are bruised, to preach the acceptable year of the Lord, and the day of reward. And when he had folded the book, he restored it to the minister, and sat down. And the eyes of all in the synagogue were fixed on him. And he began to say to them: This day is fulfilled this scripture in your ears. And all gave testimony to him: and they wondered at the words of grace that proceeded from his mouth, and they said: Is not this the son of Joseph?

And he said to them: Doubtless you will say to me this similitude: Physician, heal thyself: as great things as we have heard done in Capharnaum, do also here in thy own country. And he said: Amen I say to you, that no prophet is accepted in his own country. In truth I say to you, there were many widows in the days of Elias in Israel, when heaven was shut up three years and six months, when there was a great famine throughout all the earth. And to none of them was Elias sent, but to Sarepta of Sidon, to a widow woman. And there were many lepers in Israel in the time of Eliseus the prophet: and none of them was cleansed but Naaman the Syrian.

And all they in the synagogue, hearing these things, were filled with anger. And they rose up and thrust him out of the city; and they brought him to the brow of the hill, whereon their city was built, that they might cast him down headlong. But he passing through the midst of them, went his way.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 1, '', 'es', 'Lc 4:16-30',
'Fue a Nazaret, donde se había criado. El sábado entró en la sinagoga, como era su costumbre, y se levantó para hacer la lectura. Le entregaron el libro del profeta Isaías. Lo abrió y encontró el pasaje donde estaba escrito: «El Espíritu del Señor está sobre mí, porque me ha consagrado para llevar la Buena Noticia a los pobres, me ha enviado a anunciar la liberación a los cautivos, la vista a los ciegos, a poner en libertad a los oprimidos, y a proclamar el año de gracia del Señor.»

Luego enrolló el libro, lo devolvió al ayudante y se sentó. Todos los que estaban en la sinagoga tenían sus ojos fijos en él. Y comenzó a decirles: «Hoy se ha cumplido este pasaje de la Escritura que acaban de oír.» Todos le daban su aprobación y estaban admirados de las palabras de gracia que salían de sus labios, y decían: «¿No es este el hijo de José?»

Él les dijo: «Seguramente me van a citar aquel refrán: "Médico, cúrate a ti mismo." Y me dirán: "Haz también aquí en tu tierra lo que hemos oído que hiciste en Cafarnaúm."» Y añadió: «Les digo de verdad que ningún profeta es bien recibido en su tierra. En los tiempos de Elías, cuando el cielo estuvo cerrado durante tres años y seis meses y hubo una gran hambre en todo el país, había muchas viudas en Israel; sin embargo, Elías no fue enviado a ninguna de ellas, sino a una viuda de Sarepta, en tierra de Sidón. En tiempos del profeta Eliseo había muchos leprosos en Israel, pero ninguno de ellos quedó limpio, sino Naamán el sirio.»

Al oír estas palabras, todos los que estaban en la sinagoga se llenaron de indignación. Se levantaron, lo empujaron fuera del pueblo y lo llevaron hasta un precipicio del cerro en que estaba construida la ciudad, con intención de despeñarlo. Pero Jesús, pasando por en medio de ellos, se fue.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 1, '', 'es', 'Lc 4:16-30',
'Fue a Nazaret, donde se había criado. El sábado entró en la sinagoga, como era su costumbre, y se levantó para hacer la lectura. Le entregaron el libro del profeta Isaías. Lo abrió y encontró el pasaje donde estaba escrito: «El Espíritu del Señor está sobre mí, porque me ha consagrado para llevar la Buena Noticia a los pobres, me ha enviado a anunciar la liberación a los cautivos, la vista a los ciegos, a poner en libertad a los oprimidos, y a proclamar el año de gracia del Señor.»

Luego enrolló el libro, lo devolvió al ayudante y se sentó. Todos los que estaban en la sinagoga tenían sus ojos fijos en él. Y comenzó a decirles: «Hoy se ha cumplido este pasaje de la Escritura que acaban de oír.» Todos le daban su aprobación y estaban admirados de las palabras de gracia que salían de sus labios, y decían: «¿No es este el hijo de José?»

Él les dijo: «Seguramente me van a citar aquel refrán: "Médico, cúrate a ti mismo." Y me dirán: "Haz también aquí en tu tierra lo que hemos oído que hiciste en Cafarnaúm."» Y añadió: «Les digo de verdad que ningún profeta es bien recibido en su tierra. En los tiempos de Elías, cuando el cielo estuvo cerrado durante tres años y seis meses y hubo una gran hambre en todo el país, había muchas viudas en Israel; sin embargo, Elías no fue enviado a ninguna de ellas, sino a una viuda de Sarepta, en tierra de Sidón. En tiempos del profeta Eliseo había muchos leprosos en Israel, pero ninguno de ellos quedó limpio, sino Naamán el sirio.»

Al oír estas palabras, todos los que estaban en la sinagoga se llenaron de indignación. Se levantaron, lo empujaron fuera del pueblo y lo llevaron hasta un precipicio del cerro en que estaba construida la ciudad, con intención de despeñarlo. Pero Jesús, pasando por en medio de ellos, se fue.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- TUESDAY Week 22: Luke 4:31-37
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 2, '', 'en', 'Lk 4:31-37',
'And he went down into Capharnaum, a city of Galilee, and there he taught them on the sabbath days. And they were astonished at his doctrine: for his speech was with power. And in the synagogue there was a man who had an unclean devil, and he cried out with a loud voice, Saying: Let us alone, what have we to do with thee, Jesus of Nazareth? art thou come to destroy us? I know thee who thou art, the Holy One of God. And Jesus rebuked him, saying: Hold thy peace, and go out of him. And when the devil had thrown him into the midst, he went out of him, and hurt him not at all. And there came fear upon all, and they talked among themselves, saying: What word is this, for with authority and power he commandeth the unclean spirits, and they go out? And the fame of him was published into every place of the country round about.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 2, '', 'en', 'Lk 4:31-37',
'And he went down into Capharnaum, a city of Galilee, and there he taught them on the sabbath days. And they were astonished at his doctrine: for his speech was with power. And in the synagogue there was a man who had an unclean devil, and he cried out with a loud voice, Saying: Let us alone, what have we to do with thee, Jesus of Nazareth? art thou come to destroy us? I know thee who thou art, the Holy One of God. And Jesus rebuked him, saying: Hold thy peace, and go out of him. And when the devil had thrown him into the midst, he went out of him, and hurt him not at all. And there came fear upon all, and they talked among themselves, saying: What word is this, for with authority and power he commandeth the unclean spirits, and they go out? And the fame of him was published into every place of the country round about.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 2, '', 'es', 'Lc 4:31-37',
'Bajó a Cafarnaúm, ciudad de Galilea, y los enseñaba los sábados. Y se admiraban de su doctrina, porque su palabra tenía autoridad.

Había en la sinagoga un hombre que tenía un espíritu de demonio impuro, el cual exclamó con gran voz: «¡Déjanos! ¿Qué tienes tú con nosotros, Jesús de Nazaret? ¿Has venido a destruirnos? Sé quién eres: el Santo de Dios.» Jesús lo reprendió, diciendo: «¡Cállate y sal de él!» Y el demonio, después de haberlo tirado en tierra en medio de ellos, salió de él sin hacerle ningún daño.

Todos se asombraron y se decían unos a otros: «¿Qué tiene esta palabra? ¡Con autoridad y poder manda a los espíritus impuros, y salen!» Y su fama se extendía por todos los lugares de los alrededores.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 2, '', 'es', 'Lc 4:31-37',
'Bajó a Cafarnaúm, ciudad de Galilea, y los enseñaba los sábados. Y se admiraban de su doctrina, porque su palabra tenía autoridad.

Había en la sinagoga un hombre que tenía un espíritu de demonio impuro, el cual exclamó con gran voz: «¡Déjanos! ¿Qué tienes tú con nosotros, Jesús de Nazaret? ¿Has venido a destruirnos? Sé quién eres: el Santo de Dios.» Jesús lo reprendió, diciendo: «¡Cállate y sal de él!» Y el demonio, después de haberlo tirado en tierra en medio de ellos, salió de él sin hacerle ningún daño.

Todos se asombraron y se decían unos a otros: «¿Qué tiene esta palabra? ¡Con autoridad y poder manda a los espíritus impuros, y salen!» Y su fama se extendía por todos los lugares de los alrededores.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- WEDNESDAY Week 22: Luke 4:38-44
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 3, '', 'en', 'Lk 4:38-44',
'And Jesus rising up out of the synagogue, went into Simon''s house. And Simon''s wife''s mother was taken with a great fever, and they besought him for her. And standing over her, he commanded the fever, and it left her. And immediately rising, she ministered to them.

And when the sun was set, all they that had any sick with divers diseases, brought them to him. But he laying his hands on every one of them, healed them. And devils went out from many, crying out and saying: Thou art the Son of God. And rebuking them he suffered them not to speak, for they knew that he was Christ.

And when it was day, going out he went into a desert place, and the multitudes sought him, and they came unto him: and they stayed him that he should not depart from them. To whom he said: To other cities also I must preach the kingdom of God: for therefore am I sent. And he was preaching in the synagogues of Galilee.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 3, '', 'en', 'Lk 4:38-44',
'And Jesus rising up out of the synagogue, went into Simon''s house. And Simon''s wife''s mother was taken with a great fever, and they besought him for her. And standing over her, he commanded the fever, and it left her. And immediately rising, she ministered to them.

And when the sun was set, all they that had any sick with divers diseases, brought them to him. But he laying his hands on every one of them, healed them. And devils went out from many, crying out and saying: Thou art the Son of God. And rebuking them he suffered them not to speak, for they knew that he was Christ.

And when it was day, going out he went into a desert place, and the multitudes sought him, and they came unto him: and they stayed him that he should not depart from them. To whom he said: To other cities also I must preach the kingdom of God: for therefore am I sent. And he was preaching in the synagogues of Galilee.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 3, '', 'es', 'Lc 4:38-44',
'Al salir de la sinagoga, entró en casa de Simón. La suegra de Simón tenía una fiebre muy alta, y le pidieron que hiciera algo por ella. Él se inclinó sobre ella, dio una orden a la fiebre y la fiebre la dejó. Ella se levantó enseguida y se puso a servirles.

Al atardecer, todos los que tenían enfermos de diversas dolencias se los llevaban; y él, imponiendo las manos sobre cada uno, los curaba. También salían demonios de muchos, gritando: «¡Tú eres el Hijo de Dios!» Pero él los reprendía y no los dejaba hablar, porque sabían que él era el Cristo.

Al amanecer salió y fue a un lugar desierto. La gente lo buscaba, y cuando lo encontraron, intentaban retenerlo para que no se alejara de ellos. Pero él les dijo: «También a las otras ciudades tengo que anunciar la Buena Noticia del Reino de Dios, porque para eso he sido enviado.» Y predicaba en las sinagogas de Judea.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 3, '', 'es', 'Lc 4:38-44',
'Al salir de la sinagoga, entró en casa de Simón. La suegra de Simón tenía una fiebre muy alta, y le pidieron que hiciera algo por ella. Él se inclinó sobre ella, dio una orden a la fiebre y la fiebre la dejó. Ella se levantó enseguida y se puso a servirles.

Al atardecer, todos los que tenían enfermos de diversas dolencias se los llevaban; y él, imponiendo las manos sobre cada uno, los curaba. También salían demonios de muchos, gritando: «¡Tú eres el Hijo de Dios!» Pero él los reprendía y no los dejaba hablar, porque sabían que él era el Cristo.

Al amanecer salió y fue a un lugar desierto. La gente lo buscaba, y cuando lo encontraron, intentaban retenerlo para que no se alejara de ellos. Pero él les dijo: «También a las otras ciudades tengo que anunciar la Buena Noticia del Reino de Dios, porque para eso he sido enviado.» Y predicaba en las sinagogas de Judea.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- THURSDAY Week 22: Luke 5:1-11
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 4, '', 'en', 'Lk 5:1-11',
'And it came to pass, that when the multitudes pressed upon him to hear the word of God, he stood by the lake of Genesareth, And saw two ships standing by the lake: but the fishermen were gone out of them, and were washing their nets. And going into one of the ships that was Simon''s, he desired him to draw back a little from the land. And sitting he taught the multitudes out of the ship.

Now when he had ceased to speak, he said to Simon: Launch out into the deep, and let down your nets for a draught. And Simon answering said to him: Master, we have laboured all the night, and have taken nothing: but at thy word I will let down the net. And when they had done this, they enclosed a very great multitude of fishes, and their net broke. And they beckoned to their partners that were in the other ship, that they should come and help them. And they came, and filled both the ships, so that they were almost sinking.

Which when Simon Peter saw, he fell down at Jesus'' knees, saying: Depart from me, for I am a sinful man, O Lord. For he was wholly astonished, and all that were with him, at the draught of the fishes which they had taken. And so were also James and John the sons of Zebedee, who were Simon''s partners. And Jesus saith to Simon: Fear not: from henceforth thou shalt catch men. And having brought their ships to land, leaving all things, they followed him.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 4, '', 'en', 'Lk 5:1-11',
'And it came to pass, that when the multitudes pressed upon him to hear the word of God, he stood by the lake of Genesareth, And saw two ships standing by the lake: but the fishermen were gone out of them, and were washing their nets. And going into one of the ships that was Simon''s, he desired him to draw back a little from the land. And sitting he taught the multitudes out of the ship.

Now when he had ceased to speak, he said to Simon: Launch out into the deep, and let down your nets for a draught. And Simon answering said to him: Master, we have laboured all the night, and have taken nothing: but at thy word I will let down the net. And when they had done this, they enclosed a very great multitude of fishes, and their net broke. And they beckoned to their partners that were in the other ship, that they should come and help them. And they came, and filled both the ships, so that they were almost sinking.

Which when Simon Peter saw, he fell down at Jesus'' knees, saying: Depart from me, for I am a sinful man, O Lord. For he was wholly astonished, and all that were with him, at the draught of the fishes which they had taken. And so were also James and John the sons of Zebedee, who were Simon''s partners. And Jesus saith to Simon: Fear not: from henceforth thou shalt catch men. And having brought their ships to land, leaving all things, they followed him.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 4, '', 'es', 'Lc 5:1-11',
'Un día, estando Jesús a orillas del lago de Genesaret, la multitud se agolpaba a su alrededor para escuchar la palabra de Dios. Vio dos barcas a la orilla del lago; los pescadores habían bajado de ellas y estaban lavando las redes. Subió a una de ellas, que era la de Simón, y le pidió que se alejara un poco de la orilla. Luego se sentó y desde la barca enseñaba a la multitud.

Cuando terminó de hablar, dijo a Simón: «Lleva la barca mar adentro y echen sus redes para pescar.» Simón le respondió: «Maestro, hemos trabajado toda la noche y no hemos pescado nada; pero, ya que tú lo dices, echaré las redes.» Lo hicieron así, y recogieron una cantidad tan grande de peces que las redes estaban a punto de romperse. Entonces llamaron por señas a sus compañeros de la otra barca para que vinieran a ayudarles. Vinieron, y llenaron tanto las dos barcas que casi se hundían.

Al ver esto, Simón Pedro cayó de rodillas ante Jesús, diciendo: «Aléjate de mí, Señor, porque soy un hombre pecador.» Pues el asombro se había apoderado de él y de todos los que estaban con él, a causa de los peces que habían recogido; lo mismo les pasaba a Santiago y a Juan, hijos de Zebedeo, compañeros de Simón.

Jesús dijo a Simón: «No temas; desde ahora serás pescador de hombres.» Y una vez que condujeron las barcas a tierra, lo dejaron todo y lo siguieron.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 4, '', 'es', 'Lc 5:1-11',
'Un día, estando Jesús a orillas del lago de Genesaret, la multitud se agolpaba a su alrededor para escuchar la palabra de Dios. Vio dos barcas a la orilla del lago; los pescadores habían bajado de ellas y estaban lavando las redes. Subió a una de ellas, que era la de Simón, y le pidió que se alejara un poco de la orilla. Luego se sentó y desde la barca enseñaba a la multitud.

Cuando terminó de hablar, dijo a Simón: «Lleva la barca mar adentro y echen sus redes para pescar.» Simón le respondió: «Maestro, hemos trabajado toda la noche y no hemos pescado nada; pero, ya que tú lo dices, echaré las redes.» Lo hicieron así, y recogieron una cantidad tan grande de peces que las redes estaban a punto de romperse. Entonces llamaron por señas a sus compañeros de la otra barca para que vinieran a ayudarles. Vinieron, y llenaron tanto las dos barcas que casi se hundían.

Al ver esto, Simón Pedro cayó de rodillas ante Jesús, diciendo: «Aléjate de mí, Señor, porque soy un hombre pecador.» Pues el asombro se había apoderado de él y de todos los que estaban con él, a causa de los peces que habían recogido; lo mismo les pasaba a Santiago y a Juan, hijos de Zebedeo, compañeros de Simón.

Jesús dijo a Simón: «No temas; desde ahora serás pescador de hombres.» Y una vez que condujeron las barcas a tierra, lo dejaron todo y lo siguieron.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- FRIDAY Week 22: Luke 5:33-39
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 5, '', 'en', 'Lk 5:33-39',
'And they said to him: Why do the disciples of John fast often, and make prayers, and the disciples of the Pharisees in like manner; but thine eat and drink? To whom he said: Can you make the children of the bridegroom fast, whilst the bridegroom is with them? But the days will come, when the bridegroom shall be taken away from them, then shall they fast in those days.

And he spoke also a similitude to them: That no man putteth a piece from a new garment upon an old garment; otherwise he both rendeth the new, and the piece taken from the new agreeth not with the old. And no man putteth new wine into old bottles: otherwise the new wine will break the bottles, and it will be spilled, and the bottles will be lost. But new wine must be put into new bottles, and both are preserved. And no man drinking old, hath presently a mind to new; for he saith, The old is better.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 5, '', 'en', 'Lk 5:33-39',
'And they said to him: Why do the disciples of John fast often, and make prayers, and the disciples of the Pharisees in like manner; but thine eat and drink? To whom he said: Can you make the children of the bridegroom fast, whilst the bridegroom is with them? But the days will come, when the bridegroom shall be taken away from them, then shall they fast in those days.

And he spoke also a similitude to them: That no man putteth a piece from a new garment upon an old garment; otherwise he both rendeth the new, and the piece taken from the new agreeth not with the old. And no man putteth new wine into old bottles: otherwise the new wine will break the bottles, and it will be spilled, and the bottles will be lost. But new wine must be put into new bottles, and both are preserved. And no man drinking old, hath presently a mind to new; for he saith, The old is better.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 5, '', 'es', 'Lc 5:33-39',
'Ellos le dijeron: «Los discípulos de Juan ayunan frecuentemente y hacen oraciones; lo mismo hacen los de los fariseos. En cambio, los tuyos comen y beben.» Jesús les respondió: «¿Acaso podéis hacer que los amigos del novio ayunen mientras el novio está con ellos? Llegará el momento en que el novio les sea quitado; entonces sí ayunarán.»

Les propuso también esta comparación: «Nadie corta un trozo de un vestido nuevo para remendar un vestido viejo; de lo contrario, el vestido nuevo quedará estropeado y el remiendo nuevo no pegará con el viejo. Nadie echa vino nuevo en odres viejos; porque de lo contrario, el vino nuevo reventará los odres, el vino se derramará y los odres se perderán. El vino nuevo hay que echarlo en odres nuevos. Y nadie que haya bebido vino añejo querrá vino nuevo, porque dice: el añejo es mejor.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 5, '', 'es', 'Lc 5:33-39',
'Ellos le dijeron: «Los discípulos de Juan ayunan frecuentemente y hacen oraciones; lo mismo hacen los de los fariseos. En cambio, los tuyos comen y beben.» Jesús les respondió: «¿Acaso podéis hacer que los amigos del novio ayunen mientras el novio está con ellos? Llegará el momento en que el novio les sea quitado; entonces sí ayunarán.»

Les propuso también esta comparación: «Nadie corta un trozo de un vestido nuevo para remendar un vestido viejo; de lo contrario, el vestido nuevo quedará estropeado y el remiendo nuevo no pegará con el viejo. Nadie echa vino nuevo en odres viejos; porque de lo contrario, el vino nuevo reventará los odres, el vino se derramará y los odres se perderán. El vino nuevo hay que echarlo en odres nuevos. Y nadie que haya bebido vino añejo querrá vino nuevo, porque dice: el añejo es mejor.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- SATURDAY Week 22: Luke 6:1-5
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 6, '', 'en', 'Lk 6:1-5',
'And it came to pass on the second first sabbath, that as he went through the corn fields, his disciples plucked the ears, and did eat, rubbing them in their hands. And some of the Pharisees said to them: Why do you that which is not lawful on the sabbath days? And Jesus answering them, said: Have you not read so much as this, what David did, when himself was hungry, and they that were with him: How he went into the house of God, and took and ate the bread of proposition, and gave to them that were with him, which is not lawful to eat but only for the priests? And he said to them: The Son of man is Lord also of the sabbath.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 6, '', 'en', 'Lk 6:1-5',
'And it came to pass on the second first sabbath, that as he went through the corn fields, his disciples plucked the ears, and did eat, rubbing them in their hands. And some of the Pharisees said to them: Why do you that which is not lawful on the sabbath days? And Jesus answering them, said: Have you not read so much as this, what David did, when himself was hungry, and they that were with him: How he went into the house of God, and took and ate the bread of proposition, and gave to them that were with him, which is not lawful to eat but only for the priests? And he said to them: The Son of man is Lord also of the sabbath.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 22, 6, '', 'es', 'Lc 6:1-5',
'Un sábado Jesús pasaba por unos sembrados, y sus discípulos arrancaban espigas, las desgranaban con las manos y se las comían. Algunos fariseos les dijeron: «¿Por qué hacen lo que no está permitido hacer en sábado?» Jesús les respondió: «¿No han leído lo que hizo David cuando él y sus compañeros tuvieron hambre? Entró en la Casa de Dios, tomó los panes de la ofrenda, comió de ellos y dio también a sus compañeros, aunque esos panes no tienen derecho a comerlos sino solo los sacerdotes.» Y les dijo: «El Hijo del hombre es Señor del sábado.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 22, 6, '', 'es', 'Lc 6:1-5',
'Un sábado Jesús pasaba por unos sembrados, y sus discípulos arrancaban espigas, las desgranaban con las manos y se las comían. Algunos fariseos les dijeron: «¿Por qué hacen lo que no está permitido hacer en sábado?» Jesús les respondió: «¿No han leído lo que hizo David cuando él y sus compañeros tuvieron hambre? Entró en la Casa de Dios, tomó los panes de la ofrenda, comió de ellos y dio también a sus compañeros, aunque esos panes no tienen derecho a comerlos sino solo los sacerdotes.» Y les dijo: «El Hijo del hombre es Señor del sábado.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;
