-- Lectionary: Week 8 Ordinary Time — Saturday — complete rows
-- Generated from Little Claraval DATA.xlsx

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text, psalm_ref, psalm_text,
  second_reading_ref, second_reading_text, gospel_ref, gospel_text)
VALUES (
  'I', 'ordinary', 8, 6, '', 'es',
  'Sábado Semana 8 TO', 'green',
  'Si 51,12cd-20', 'Por eso le doy gracias, y alabo y bendigo el nombre del Señor. Den gracias al Señor, porque él es bueno, porque su amor es eterno. Den gracias al Dios de la alabanza, porque su amor es eterno. Den gracias al protector de Israel, porque su amor es eterno. Den gracias al Creador del universo, porque su amor es eterno. Den gracias al redentor de Israel, porque su amor es eterno. Den gracias al que reúne a los israelitas dispersos, porque su amor es eterno. Den gracias al que reconstruye la ciudad y el templo, porque su amor es eterno. Den gracias al que hace renacer el poder de la dinastía de David, porque su amor es eterno. Den gracias al que escogió como sacerdotes a los descendientes de Sadoc, porque su amor es eterno. Den gracias al protector de Abraham, porque su amor es eterno. Den gracias al refugio de Isaac, porque su amor es eterno. Den gracias al Dios poderoso de Jacob, porque su amor es eterno. Den gracias al que eligió a Sión, porque su amor es eterno. Den gracias al Rey de todos los reyes, porque su amor es eterno. ¡Él ha dado poder a su pueblo! Alabanza de todos sus fieles, de los israelitas, su pueblo cercano. ¡Alabado sea el Señor!

Cuando yo era joven, antes de irme a recorrer mundo, deseaba ardientemente recibir sabiduría. Y ella vino a mí en toda su belleza; yo la busqué hasta que di por fin con ella. Estaba en su punto, como racimo maduro, y en ella se alegró mi corazón. Yo seguí fielmente su camino, porque desde pequeño la había aprendido. En el poco tiempo que estuve escuchándola, aprendí muchas cosas. Someterme a ella me fue un honor, por eso doy gracias a quien me la enseñó. Decidí alcanzar algún bien, y no cambiarlo por nada cuando lo encontrara. Me enamoré de ella, y en ella tuve siempre fija la mirada. Abrí la puerta de su casa para abrazarla y contemplarla. La deseé con toda mi alma, y la encontré en toda su pureza. Desde el primer momento me enamoré de ella, y por eso no la abandonaré, jamás me apartaré de ella.',
  'Sal 18', 'Al maestro del coro. Salmo de David . Los cielos proclaman la grandeza del Señor, el firmamento pregona la obra de sus manos; el día al día comunica su mensaje, la noche a la noche anuncia la noticia: sin lenguaje, sin palabras, sin que se escuche su voz, se difunde su sonido por toda la tierra, y por los confines del mundo su mensaje. En ellos ha erigido una tienda para el sol que recorre alegre su camino como atleta, como novio que sale de su alcoba. Sale por un extremo del cielo y en su órbita llega hasta el otro: nada escapa a su calor. La ley del Señor es perfecta, reconforta al ser humano; el mandato del Señor es firme, al sencillo lo hace sabio; los decretos del Señor son rectos, alegran el corazón; el mandamiento del Señor es nítido, llena los ojos de luz; venerar al Señor comunica santidad, es algo que permanece para siempre; los juicios del Señor son verdad, todos ellos son justos. Son más cautivadores que el oro, más que abundante oro fino, más dulces que la miel, que la miel virgen del panal. Tu siervo está atento a ellos; grande es el premio si se respetan. Pero, ¿quién conoce sus propios errores? Perdóname los que ignoro. Libra a tu siervo de la arrogancia, ¡que no me domine! Y entonces seré íntegro, inocente de un gran pecado. Que te sean gratas mis palabras y te deleiten mis pensamientos, Señor, mi fortaleza, mi redentor.',
  NULL, NULL,
  'Mc 11,27-33', 'Cuando llegaron de nuevo a Jerusalén, mientras Jesús estaba paseando por el Templo, se acercaron a él los jefes de los sacerdotes, los maestros de la ley y los ancianos, y le preguntaron: — ¿Con qué derecho haces tú todo eso? ¿Quién te ha autorizado a hacer lo que estás haciendo? Jesús les contestó: — Yo también voy a preguntaros una cosa. Respondedme y os diré con qué derecho hago todo esto. ¿De quién recibió Juan el encargo de bautizar: de Dios o de los hombres? ¡Respondedme! Ellos se pusieron a razonar entre sí: “Si contestamos que lo recibió de Dios, él dirá: ‘¿Por qué, pues, no le creísteis?’ Pero ¿cómo vamos a decir que lo recibió de los hombres?”. Y es que temían la reacción del pueblo, porque todos tenían a Juan por profeta. Así que respondieron: — No lo sabemos. Entonces Jesús les replicó: — Pues tampoco yo os diré con qué derecho hago todo esto.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  first_reading_ref = EXCLUDED.first_reading_ref, first_reading_text = EXCLUDED.first_reading_text,
  psalm_ref = EXCLUDED.psalm_ref, psalm_text = EXCLUDED.psalm_text,
  second_reading_ref = EXCLUDED.second_reading_ref, second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text, psalm_ref, psalm_text,
  second_reading_ref, second_reading_text, gospel_ref, gospel_text)
VALUES (
  'I', 'ordinary', 8, 6, '', 'en',
  'Saturday Week 8 OT', 'green',
  'Si 51,12cd-20', 'How thou deliverest them that wait for thee, O Lord, and savest them out of the hands of the nations. Thou hast exalted my dwelling place upon the earth and I have prayed for death to pass away. I called upon the Lord, the father of my Lord, that he would not leave me in the day of my trouble, and in the time of the proud without help. I will praise thy name continually, and will praise it with thanksgiving, and my prayer was heard. And thou hast saved me from destruction, and hast delivered me from the evil time. Therefore I will give thanks, and praise thee, and bless the name of the Lord. When I was yet young, before I wandered about, I sought for wisdom openly in my prayer. I prayed for her before the temple, and unto the very end I will seek after her, and she flourished as a grape soon ripe. My heart delighted in her, my foot walked in the right way, from my youth up I sought after her.',
  'Sal 18', 'Unto the end. A psalm for David. May the Lord hear thee in the day of tribulation: may the name of the God of Jacob protect thee. May he send thee help from the sanctuary: and defend thee out of Sion. May he be mindful of all thy sacrifices: and may thy whole burnt offering be made fat. May he give thee according to thy own heart; and confirm all thy counsels. We will rejoice in thy salvation; and in the name of our God we shall be exalted. The Lord fulfill all thy petitions: now have I known that the Lord hath saved his anointed. He will hear him from his holy heaven: the salvation of his right hand is in powers. Some trust in chariots, and some in horses: but we will call upon the name of the Lord our God. They are bound, and have fallen; but we are risen, and are set upright. O Lord, save the king: and hear us in the day that we shall call upon thee.',
  NULL, NULL,
  'Mc 11,27-33', 'And they come again to Jerusalem. And when he was walking in the temple, there come to him the chief priests and the scribes and the ancients, And they say to him: By what authority dost thou these things? and who hath given thee this authority that thou shouldst do these things? And Jesus answering, said to them: I will also ask you one word, and answer you me, and I will tell you by what authority I do these things. The baptism of John, was it from heaven, or from men? Answer me. But they thought with themselves, saying: If we say, From heaven; he will say, Why then did you not believe him? If we say, From men, we fear the people. For all men counted John that he was a prophet indeed. And they answering, say to Jesus: We know not. And Jesus answering, saith to them: Neither do I tell you by what authority I do these things.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  first_reading_ref = EXCLUDED.first_reading_ref, first_reading_text = EXCLUDED.first_reading_text,
  psalm_ref = EXCLUDED.psalm_ref, psalm_text = EXCLUDED.psalm_text,
  second_reading_ref = EXCLUDED.second_reading_ref, second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text, psalm_ref, psalm_text,
  second_reading_ref, second_reading_text, gospel_ref, gospel_text)
VALUES (
  'II', 'ordinary', 8, 6, '', 'es',
  'Sábado Semana 8 TO', 'green',
  'Jds 17.20b-25', 'Pero vosotros, amados míos, recordad lo que predijeron los apóstoles de nuestro Señor Jesucristo.

Vosotros, en cambio, amados míos, haced de una fe tan santa como la vuestra el firme cimiento de vuestra vida; orad impulsados por el Espíritu Santo y manteneos en el amor de Dios, esperando que la misericordia de nuestro Señor Jesucristo os lleve a la vida eterna.

Tened compasión de los que vacilan, contando con que a unos los salvaréis arrancándolos del fuego; pero a otros sólo podréis compadecerlos, y eso con cautela, evitando incluso el contacto superficial con su torpe conducta.

Al que puede manteneros limpios de pecado y conduciros alegres y sin mancha hasta su gloriosa presencia, al Dios único que es nuestro Salvador, a él la gloria, la majestad, la soberanía y el poder, por medio de nuestro Señor Jesucristo, desde antes de todos los tiempos, ahora y por los siglos sin fin. Amén.',
  'Sal 62', 'Salmo de David. Cuando estaba en el desierto de Judá. Oh Dios, tú eres mi Dios y al alba te busco; de ti tengo sed y por ti desfallezco en una tierra árida, seca y sin agua. Te contemplé en tu santuario, vi tu poder y tu gloria. Tu amor es mejor que la vida, mis labios cantarán tu alabanza. Te bendeciré mientras viva, por tu nombre alzaré mis manos. Me saciaré de aceite y de grasa, te ensalzará mi boca con gozo. Si acostado te recuerdo, no duermo pensando en ti; pues tú eres mi socorro, bajo tus alas me regocijo. Estoy adherido a ti, tu diestra me sostiene. Quienes desean destruirme acabarán bajo la tierra, quedarán a merced de la espada, serán presa de chacales. Y el rey se alegrará en Dios, se gozará quien juró por él y enmudecerán los mentirosos.',
  NULL, NULL,
  'Mc 11,27-33', 'Cuando llegaron de nuevo a Jerusalén, mientras Jesús estaba paseando por el Templo, se acercaron a él los jefes de los sacerdotes, los maestros de la ley y los ancianos, y le preguntaron: — ¿Con qué derecho haces tú todo eso? ¿Quién te ha autorizado a hacer lo que estás haciendo? Jesús les contestó: — Yo también voy a preguntaros una cosa. Respondedme y os diré con qué derecho hago todo esto. ¿De quién recibió Juan el encargo de bautizar: de Dios o de los hombres? ¡Respondedme! Ellos se pusieron a razonar entre sí: “Si contestamos que lo recibió de Dios, él dirá: ‘¿Por qué, pues, no le creísteis?’ Pero ¿cómo vamos a decir que lo recibió de los hombres?”. Y es que temían la reacción del pueblo, porque todos tenían a Juan por profeta. Así que respondieron: — No lo sabemos. Entonces Jesús les replicó: — Pues tampoco yo os diré con qué derecho hago todo esto.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  first_reading_ref = EXCLUDED.first_reading_ref, first_reading_text = EXCLUDED.first_reading_text,
  psalm_ref = EXCLUDED.psalm_ref, psalm_text = EXCLUDED.psalm_text,
  second_reading_ref = EXCLUDED.second_reading_ref, second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text, psalm_ref, psalm_text,
  second_reading_ref, second_reading_text, gospel_ref, gospel_text)
VALUES (
  'II', 'ordinary', 8, 6, '', 'en',
  'Saturday Week 8 OT', 'green',
  'Jds 17.20b-25', 'But you, my dearly beloved, be mindful of the words which have been spoken before by the apostles of our Lord Jesus Christ, who told you, that in the last time there should come mockers, walking according to their own desires in ungodlinesses. But you, my beloved, building yourselves upon your most holy faith, praying in the Holy Ghost, keep yourselves in the love of God, waiting for the mercy of our Lord Jesus Christ, unto life everlasting. And some indeed reprove, being judged: but others save, pulling them out of the fire. And on others have mercy, in fear, hating also the spotted garment which is carnal. Now to him who is able to preserve you without sin, and to present you spotless before the presence of his glory with exceeding joy, in the coming of our Lord Jesus Christ, to the only God our Saviour through Jesus Christ our Lord, be glory and magnificence, empire and power, before all ages, and now, and for all ages of ages. Amen.',
  'Sal 62', 'Unto the end, a psalm for David. Hear, O God, my prayer, when I make supplication to thee: deliver my soul from the fear of the enemy. Thou hast protected me from the assembly of the malignant; from the multitude of the workers of iniquity. For they have whetted their tongues like a sword; they have bent their bow a bitter thing, To shoot in secret the undefiled. They will shoot at him on a sudden, and will not fear: they are resolute in wickedness. They have talked of hiding snares; they have said: Who shall see them? They have searched after iniquities: they have failed in their search. Man shall come to a deep heart: And God shall be exalted. The arrows of children are their wounds: And their tongues against them are made weak. All that saw them were troubled; And every man was afraid. And they declared the works of God: and understood his doings. The just shall rejoice in the Lord, and shall hope in him: and all the upright in heart shall be praised.',
  NULL, NULL,
  'Mc 11,27-33', 'And they come again to Jerusalem. And when he was walking in the temple, there come to him the chief priests and the scribes and the ancients, And they say to him: By what authority dost thou these things? and who hath given thee this authority that thou shouldst do these things? And Jesus answering, said to them: I will also ask you one word, and answer you me, and I will tell you by what authority I do these things. The baptism of John, was it from heaven, or from men? Answer me. But they thought with themselves, saying: If we say, From heaven; he will say, Why then did you not believe him? If we say, From men, we fear the people. For all men counted John that he was a prophet indeed. And they answering, say to Jesus: We know not. And Jesus answering, saith to them: Neither do I tell you by what authority I do these things.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  first_reading_ref = EXCLUDED.first_reading_ref, first_reading_text = EXCLUDED.first_reading_text,
  psalm_ref = EXCLUDED.psalm_ref, psalm_text = EXCLUDED.psalm_text,
  second_reading_ref = EXCLUDED.second_reading_ref, second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text;
-- ═══════════════════════════════════════════════════════════════
-- REFLEXIÓN — Week 8 Ordinary Time — Ciclo II (años pares)
-- Evangelio: Mc 11,27-33 — La autoridad de Jesús
-- ═══════════════════════════════════════════════════════════════

INSERT INTO lectionary_reflections
  (cycle, season, week, feast_key, lang, title, liturgical_color,
   gospel_ref, gospel_text,
   silence, meditative_phrase, inner_question, brief_prayer,
   spiritual_school, theme, updated_at)
VALUES (
  'II', 'ordinary', 8, '', 'es',
  'VIII Semana del Tiempo Ordinario — La autoridad de Jesús', 'green',
  'Mc 11,27-33',
  'Cuando llegaron de nuevo a Jerusalén, mientras Jesús estaba paseando por el Templo, se acercaron a él los jefes de los sacerdotes, los maestros de la ley y los ancianos, y le preguntaron: «¿Con qué derecho haces tú todo eso?» Jesús les contestó: «¿De quién recibió Juan el encargo de bautizar: de Dios o de los hombres?» Respondieron: «No lo sabemos.» Y Jesús les replicó: «Pues tampoco yo os diré con qué derecho hago todo esto.»',
  'Quédate en silencio un momento. ¿Desde qué autoridad estás viviendo hoy?',
  'Tampoco yo os diré con qué autoridad hago estas cosas.',
  '¿Hay algo en mi vida donde esquivo la verdad sobre Jesús, como los jefes del Templo evitaron responder?',
  'Señor Jesús, dame la libertad de no buscar respuestas que me convengan, sino de acoger tu autoridad con fe sencilla. Amén.',
  'bernardina', 'autoridad', NOW()
)
ON CONFLICT (cycle, season, week, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text,
  silence = EXCLUDED.silence, meditative_phrase = EXCLUDED.meditative_phrase,
  inner_question = EXCLUDED.inner_question, brief_prayer = EXCLUDED.brief_prayer,
  spiritual_school = EXCLUDED.spiritual_school, theme = EXCLUDED.theme,
  updated_at = EXCLUDED.updated_at;

INSERT INTO lectionary_reflections
  (cycle, season, week, feast_key, lang, title, liturgical_color,
   gospel_ref, gospel_text,
   silence, meditative_phrase, inner_question, brief_prayer,
   spiritual_school, theme, updated_at)
VALUES (
  'II', 'ordinary', 8, '', 'en',
  'Week 8 of Ordinary Time — The Authority of Jesus', 'green',
  'Mk 11,27-33',
  'And they come again to Jerusalem. And when he was walking in the temple, there come to him the chief priests and the scribes and the ancients, And they say to him: By what authority dost thou these things? And Jesus answering, said to them: The baptism of John, was it from heaven, or from men? Answer me. And they answering, say to Jesus: We know not. And Jesus answering, saith to them: Neither do I tell you by what authority I do these things.',
  'Rest in silence for a moment. Under whose authority are you living today?',
  'Neither do I tell you by what authority I do these things.',
  'Is there something in my life where I, like the chief priests, avoid honestly answering Christ''s question?',
  'Lord Jesus, free me from seeking only the answers that suit me. Let your authority be the ground I stand on. Amen.',
  'bernardina', 'authority', NOW()
)
ON CONFLICT (cycle, season, week, feast_key, lang) DO UPDATE SET
  title = EXCLUDED.title, liturgical_color = EXCLUDED.liturgical_color,
  gospel_ref = EXCLUDED.gospel_ref, gospel_text = EXCLUDED.gospel_text,
  silence = EXCLUDED.silence, meditative_phrase = EXCLUDED.meditative_phrase,
  inner_question = EXCLUDED.inner_question, brief_prayer = EXCLUDED.brief_prayer,
  spiritual_school = EXCLUDED.spiritual_school, theme = EXCLUDED.theme,
  updated_at = EXCLUDED.updated_at;
