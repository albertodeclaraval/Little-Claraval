-- Lectionary: Week 23 Ordinary Time — Gospel readings from Luke
-- English: Douay-Rheims 1899 (public domain)
-- Weekday gospels are identical for Cycle I and Cycle II

-- ═══════════════════════════════════════════
-- SUNDAY YEAR C: Luke 14:25-33
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('C', 'ordinary', 23, 0, '', 'en', 'Lk 14:25-33',
'And there went great multitudes with him, and turning, he said to them: If any man come to me, and hate not his father, and mother, and wife, and children, and brethren, and sisters, yea and his own life also, he cannot be my disciple. And whosoever doth not carry his cross and come after me, cannot be my disciple.

For which of you having a mind to build a tower, doth not first sit down, and reckon the charges that are necessary, whether he have wherewithal to finish it: Lest, after he hath laid the foundation, and is not able to finish it, all that see it begin to mock him, Saying: This man began to build, and was not able to finish.

Or what king, about to go to make war against another king, doth not first sit down, and think whether he be able, with ten thousand, to meet him that, with twenty thousand, cometh against him? Or else, whilst the other is yet afar off, sending an embassy, he desireth conditions of peace.

So likewise every one of you that doth not renounce all that he possesseth, cannot be my disciple.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('C', 'ordinary', 23, 0, '', 'es', 'Lc 14:25-33',
'Una gran multitud seguía a Jesús, y él, dándose vuelta, les dijo: «Si alguno viene a mí y no me prefiere a su padre y a su madre, a su mujer y a sus hijos, a sus hermanos y hermanas, y hasta a su propia vida, no puede ser mi discípulo. Aquel que no carga con su cruz y me sigue, no puede ser mi discípulo.

¿Quién de ustedes, si quiere construir una torre, no se sienta primero a calcular los gastos, para ver si tiene con qué terminarla? No sea que después de haber puesto los cimientos, no pueda terminar y todos los que lo vean se pongan a burlarse de él, diciendo: "Este hombre comenzó a construir y no pudo terminar."

¿Y qué rey que va a combatir contra otro rey no se sienta antes a reflexionar si con diez mil soldados puede salirle al encuentro al que viene contra él con veinte mil? Y si no puede, cuando el otro está todavía lejos, le envía una embajada para pedirle condiciones de paz.

Así pues, el que no renuncie a todos sus bienes no puede ser mi discípulo.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- MONDAY Week 23: Luke 6:6-11
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 1, '', 'en', 'Lk 6:6-11',
'And it came to pass also on another sabbath, that he entered into the synagogue, and taught. And there was a man, whose right hand was withered. And the scribes and Pharisees watched him, whether he would heal on the sabbath; that they might find an accusation against him. But he knew their thoughts; and said to the man who had the withered hand: Arise, and stand forth in the midst. And rising he stood forth. Then Jesus said to them: I ask you, if it be lawful on the sabbath days to do good, or to do evil; to save life, or to destroy? And looking round about on them all, he said to the man: Stretch forth thy hand. And he stretched it forth: and his hand was restored. And they were filled with madness; and they talked one with another, what they might do to Jesus.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 1, '', 'en', 'Lk 6:6-11',
'And it came to pass also on another sabbath, that he entered into the synagogue, and taught. And there was a man, whose right hand was withered. And the scribes and Pharisees watched him, whether he would heal on the sabbath; that they might find an accusation against him. But he knew their thoughts; and said to the man who had the withered hand: Arise, and stand forth in the midst. And rising he stood forth. Then Jesus said to them: I ask you, if it be lawful on the sabbath days to do good, or to do evil; to save life, or to destroy? And looking round about on them all, he said to the man: Stretch forth thy hand. And he stretched it forth: and his hand was restored. And they were filled with madness; and they talked one with another, what they might do to Jesus.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 1, '', 'es', 'Lc 6:6-11',
'Otro sábado entró en la sinagoga y se puso a enseñar. Había allí un hombre que tenía la mano derecha paralizada. Los escribas y los fariseos lo observaban para ver si lo curaba en sábado, con el fin de encontrar de qué acusarlo. Pero Jesús conocía sus pensamientos y dijo al hombre que tenía la mano paralizada: «Levántate y ponte aquí en medio.» El hombre se levantó y quedó de pie.

Entonces Jesús les dijo: «Les pregunto: ¿Es lícito en sábado hacer el bien o hacer el mal, salvar la vida de un hombre o dejarlo morir?» Y mirándolos a todos alrededor, dijo al hombre: «Extiende tu mano.» Él la extendió, y su mano quedó curada. Pero ellos se pusieron furiosos y discutían entre sí qué podrían hacer contra Jesús.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 1, '', 'es', 'Lc 6:6-11',
'Otro sábado entró en la sinagoga y se puso a enseñar. Había allí un hombre que tenía la mano derecha paralizada. Los escribas y los fariseos lo observaban para ver si lo curaba en sábado, con el fin de encontrar de qué acusarlo. Pero Jesús conocía sus pensamientos y dijo al hombre que tenía la mano paralizada: «Levántate y ponte aquí en medio.» El hombre se levantó y quedó de pie.

Entonces Jesús les dijo: «Les pregunto: ¿Es lícito en sábado hacer el bien o hacer el mal, salvar la vida de un hombre o dejarlo morir?» Y mirándolos a todos alrededor, dijo al hombre: «Extiende tu mano.» Él la extendió, y su mano quedó curada. Pero ellos se pusieron furiosos y discutían entre sí qué podrían hacer contra Jesús.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- TUESDAY Week 23: Luke 6:12-19
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 2, '', 'en', 'Lk 6:12-19',
'And it came to pass in those days, that he went out into a mountain to pray, and he passed the whole night in the prayer of God. And when day was come, he called unto him his disciples; and he chose twelve of them (whom he also named apostles): Simon, whom he surnamed Peter, and Andrew his brother, James and John, Philip and Bartholomew, Matthew and Thomas, James the son of Alpheus, and Simon who is called Zelotes, And Jude, the brother of James, and Judas Iscariot, who was the traitor.

And coming down with them, he stood in a plain place, and the company of his disciples, and a great multitude of people from all Judea and Jerusalem, and the sea coast both of Tyre and Sidon, Who came to hear him, and to be healed of their diseases. And they that were troubled with unclean spirits, were cured. And all the multitude sought to touch him, for virtue went out from him, and healed all.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 2, '', 'en', 'Lk 6:12-19',
'And it came to pass in those days, that he went out into a mountain to pray, and he passed the whole night in the prayer of God. And when day was come, he called unto him his disciples; and he chose twelve of them (whom he also named apostles): Simon, whom he surnamed Peter, and Andrew his brother, James and John, Philip and Bartholomew, Matthew and Thomas, James the son of Alpheus, and Simon who is called Zelotes, And Jude, the brother of James, and Judas Iscariot, who was the traitor.

And coming down with them, he stood in a plain place, and the company of his disciples, and a great multitude of people from all Judea and Jerusalem, and the sea coast both of Tyre and Sidon, Who came to hear him, and to be healed of their diseases. And they that were troubled with unclean spirits, were cured. And all the multitude sought to touch him, for virtue went out from him, and healed all.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 2, '', 'es', 'Lc 6:12-19',
'Por aquellos días, Jesús se fue a un cerro a orar y pasó toda la noche en oración a Dios. Cuando se hizo de día, llamó a sus discípulos y eligió doce de ellos, a quienes dio el nombre de Apóstoles: Simón, a quien llamó Pedro, y su hermano Andrés; Santiago, Juan, Felipe, Bartolomé, Mateo, Tomás, Santiago hijo de Alfeo, Simón llamado el Zelote, Judas hijo de Santiago, y Judas Iscariote, que fue el traidor.

Bajó con ellos y se detuvo en una llanura. Estaban allí muchos de sus discípulos y una gran multitud de gente de toda Judea, de Jerusalén y de la costa de Tiro y Sidón, que habían venido a escucharlo y a que los curara de sus enfermedades. Los que eran atormentados por espíritus impuros quedaban curados, y toda la gente quería tocarlo, porque salía de él una fuerza que sanaba a todos.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 2, '', 'es', 'Lc 6:12-19',
'Por aquellos días, Jesús se fue a un cerro a orar y pasó toda la noche en oración a Dios. Cuando se hizo de día, llamó a sus discípulos y eligió doce de ellos, a quienes dio el nombre de Apóstoles: Simón, a quien llamó Pedro, y su hermano Andrés; Santiago, Juan, Felipe, Bartolomé, Mateo, Tomás, Santiago hijo de Alfeo, Simón llamado el Zelote, Judas hijo de Santiago, y Judas Iscariote, que fue el traidor.

Bajó con ellos y se detuvo en una llanura. Estaban allí muchos de sus discípulos y una gran multitud de gente de toda Judea, de Jerusalén y de la costa de Tiro y Sidón, que habían venido a escucharlo y a que los curara de sus enfermedades. Los que eran atormentados por espíritus impuros quedaban curados, y toda la gente quería tocarlo, porque salía de él una fuerza que sanaba a todos.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- WEDNESDAY Week 23: Luke 6:20-26
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 3, '', 'en', 'Lk 6:20-26',
'And he, lifting up his eyes on his disciples, said: Blessed are ye poor, for yours is the kingdom of God. Blessed are ye that hunger now: for you shall be filled. Blessed are ye that weep now: for you shall laugh. Blessed shall you be when men shall hate you, and when they shall separate you, and shall reproach you, and cast out your name as evil, for the Son of man''s sake. Be glad in that day and rejoice; for behold, your reward is great in heaven. For according to these things did their fathers to the prophets.

But woe to you that are rich: for you have your consolation. Woe to you that are filled: for you shall hunger. Woe to you that now laugh: for you shall mourn and weep. Woe to you when men shall bless you: for according to these things did their fathers to the false prophets.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 3, '', 'en', 'Lk 6:20-26',
'And he, lifting up his eyes on his disciples, said: Blessed are ye poor, for yours is the kingdom of God. Blessed are ye that hunger now: for you shall be filled. Blessed are ye that weep now: for you shall laugh. Blessed shall you be when men shall hate you, and when they shall separate you, and shall reproach you, and cast out your name as evil, for the Son of man''s sake. Be glad in that day and rejoice; for behold, your reward is great in heaven. For according to these things did their fathers to the prophets.

But woe to you that are rich: for you have your consolation. Woe to you that are filled: for you shall hunger. Woe to you that now laugh: for you shall mourn and weep. Woe to you when men shall bless you: for according to these things did their fathers to the false prophets.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 3, '', 'es', 'Lc 6:20-26',
'Entonces Jesús, mirando a sus discípulos, dijo:

«Felices ustedes los pobres, porque el Reino de Dios les pertenece.
Felices ustedes los que tienen hambre ahora, porque quedarán saciados.
Felices ustedes los que lloran ahora, porque reirán.
Felices ustedes cuando los hombres los odien, los excluyan, los insulten y los traten como malhechores por causa del Hijo del hombre. Alégrense ese día y salten de gozo, porque una gran recompensa les espera en el cielo. Así trataron sus padres a los profetas.

Pero, ¡ay de ustedes los ricos!, porque ya tienen su consuelo.
¡Ay de ustedes los que están saciados ahora!, porque tendrán hambre.
¡Ay de ustedes los que ríen ahora!, porque estarán tristes y llorarán.
¡Ay de ustedes cuando todo el mundo los elogie!, porque así trataron sus padres a los falsos profetas.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 3, '', 'es', 'Lc 6:20-26',
'Entonces Jesús, mirando a sus discípulos, dijo:

«Felices ustedes los pobres, porque el Reino de Dios les pertenece.
Felices ustedes los que tienen hambre ahora, porque quedarán saciados.
Felices ustedes los que lloran ahora, porque reirán.
Felices ustedes cuando los hombres los odien, los excluyan, los insulten y los traten como malhechores por causa del Hijo del hombre. Alégrense ese día y salten de gozo, porque una gran recompensa les espera en el cielo. Así trataron sus padres a los profetas.

Pero, ¡ay de ustedes los ricos!, porque ya tienen su consuelo.
¡Ay de ustedes los que están saciados ahora!, porque tendrán hambre.
¡Ay de ustedes los que ríen ahora!, porque estarán tristes y llorarán.
¡Ay de ustedes cuando todo el mundo los elogie!, porque así trataron sus padres a los falsos profetas.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- THURSDAY Week 23: Luke 6:27-38
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 4, '', 'en', 'Lk 6:27-38',
'But I say to you that hear: Love your enemies, do good to them that hate you. Bless them that curse you, and pray for them that calumniate you. And to him that striketh thee on the one cheek, offer also the other. And from him that taketh away from thee thy cloak, forbid not to take thy coat also. Give to every one that asketh thee, and of him that taketh away thy goods, ask them not again. And as you would that men should do to you, do you also to them in like manner.

For if you love them that love you, what thanks are to you? for sinners also love those that love them. And if you do good to them who do good to you, what thanks are to you? for sinners also do this. And if you lend to them of whom you hope to receive, what thanks are to you? for sinners also lend to sinners, for to receive as much.

But love ye your enemies: do good, and lend, hoping for nothing thereby: and your reward shall be great, and you shall be the sons of the Highest; for he is kind to the unthankful, and to the evil. Be ye therefore merciful, as your Father also is merciful.

Judge not, and you shall not be judged. Condemn not, and you shall not be condemned. Forgive, and you shall be forgiven. Give, and it shall be given to you: good measure and pressed down and shaken together and running over shall they give into your bosom. For with the same measure that you shall mete withal, it shall be measured to you again.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 4, '', 'en', 'Lk 6:27-38',
'But I say to you that hear: Love your enemies, do good to them that hate you. Bless them that curse you, and pray for them that calumniate you. And to him that striketh thee on the one cheek, offer also the other. And from him that taketh away from thee thy cloak, forbid not to take thy coat also. Give to every one that asketh thee, and of him that taketh away thy goods, ask them not again. And as you would that men should do to you, do you also to them in like manner.

For if you love them that love you, what thanks are to you? for sinners also love those that love them. And if you do good to them who do good to you, what thanks are to you? for sinners also do this. And if you lend to them of whom you hope to receive, what thanks are to you? for sinners also lend to sinners, for to receive as much.

But love ye your enemies: do good, and lend, hoping for nothing thereby: and your reward shall be great, and you shall be the sons of the Highest; for he is kind to the unthankful, and to the evil. Be ye therefore merciful, as your Father also is merciful.

Judge not, and you shall not be judged. Condemn not, and you shall not be condemned. Forgive, and you shall be forgiven. Give, and it shall be given to you: good measure and pressed down and shaken together and running over shall they give into your bosom. For with the same measure that you shall mete withal, it shall be measured to you again.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 4, '', 'es', 'Lc 6:27-38',
'Pero a ustedes los que me escuchan les digo: Amen a sus enemigos, hagan el bien a los que los odian, bendigan a los que los maldicen, oren por los que los calumnian. Al que te pegue en una mejilla, preséntale también la otra; al que te quite el manto, no le niegues la túnica. Da a todo el que te pida y al que tome lo tuyo no se lo reclames. Traten a los demás como quieren que los traten a ustedes.

Si aman a los que los aman, ¿qué mérito tienen? También los pecadores aman a quienes los aman. Si hacen el bien a quienes se lo hacen a ustedes, ¿qué mérito tienen? También los pecadores hacen lo mismo. Si prestan a aquellos de quienes esperan recibir, ¿qué mérito tienen? También los pecadores prestan a los pecadores para recibir lo mismo.

Amen a sus enemigos, hagan el bien y presten sin esperar nada a cambio; así tendrán una gran recompensa y serán hijos del Altísimo, que es bueno con los ingratos y los malos. Sean misericordiosos, como su Padre es misericordioso.

No juzguen y no serán juzgados; no condenen y no serán condenados; perdonen y serán perdonados. Den y se les dará: una medida buena, apretada, sacudida y rebosante les echarán en el regazo. Porque con la medida con que midan, los medirán a ustedes también.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 4, '', 'es', 'Lc 6:27-38',
'Pero a ustedes los que me escuchan les digo: Amen a sus enemigos, hagan el bien a los que los odian, bendigan a los que los maldicen, oren por los que los calumnian. Al que te pegue en una mejilla, preséntale también la otra; al que te quite el manto, no le niegues la túnica. Da a todo el que te pida y al que tome lo tuyo no se lo reclames. Traten a los demás como quieren que los traten a ustedes.

Si aman a los que los aman, ¿qué mérito tienen? También los pecadores aman a quienes los aman. Si hacen el bien a quienes se lo hacen a ustedes, ¿qué mérito tienen? También los pecadores hacen lo mismo. Si prestan a aquellos de quienes esperan recibir, ¿qué mérito tienen? También los pecadores prestan a los pecadores para recibir lo mismo.

Amen a sus enemigos, hagan el bien y presten sin esperar nada a cambio; así tendrán una gran recompensa y serán hijos del Altísimo, que es bueno con los ingratos y los malos. Sean misericordiosos, como su Padre es misericordioso.

No juzguen y no serán juzgados; no condenen y no serán condenados; perdonen y serán perdonados. Den y se les dará: una medida buena, apretada, sacudida y rebosante les echarán en el regazo. Porque con la medida con que midan, los medirán a ustedes también.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- FRIDAY Week 23: Luke 6:39-42
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 5, '', 'en', 'Lk 6:39-42',
'And he spoke also to them a similitude: Can the blind lead the blind? do they not both fall into the ditch? The disciple is not above his master: but every one shall be perfect, if he be as his master. And why seest thou the mote in thy brother''s eye, but the beam that is in thy own eye thou considerest not? Or how canst thou say to thy brother: Brother, let me pull the mote out of thy eye, when thou thyself seest not the beam in thy own eye? Hypocrite, cast first the beam out of thy own eye; and then shalt thou see clearly to take out the mote from thy brother''s eye.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 5, '', 'en', 'Lk 6:39-42',
'And he spoke also to them a similitude: Can the blind lead the blind? do they not both fall into the ditch? The disciple is not above his master: but every one shall be perfect, if he be as his master. And why seest thou the mote in thy brother''s eye, but the beam that is in thy own eye thou considerest not? Or how canst thou say to thy brother: Brother, let me pull the mote out of thy eye, when thou thyself seest not the beam in thy own eye? Hypocrite, cast first the beam out of thy own eye; and then shalt thou see clearly to take out the mote from thy brother''s eye.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 5, '', 'es', 'Lc 6:39-42',
'Les propuso también esta comparación: «¿Puede un ciego guiar a otro ciego? ¿No caerán los dos en el hoyo? El discípulo no es superior a su maestro; pero todo el que llegue a serlo plenamente, será como su maestro.

¿Por qué miras la paja que hay en el ojo de tu hermano y no te fijas en la viga que hay en el tuyo? ¿Cómo puedes decirle a tu hermano: "Hermano, déjame sacarte la paja de tu ojo", si no ves la viga que hay en el tuyo? ¡Hipócrita! Saca primero la viga de tu ojo y entonces verás bien para sacar la paja del ojo de tu hermano.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 5, '', 'es', 'Lc 6:39-42',
'Les propuso también esta comparación: «¿Puede un ciego guiar a otro ciego? ¿No caerán los dos en el hoyo? El discípulo no es superior a su maestro; pero todo el que llegue a serlo plenamente, será como su maestro.

¿Por qué miras la paja que hay en el ojo de tu hermano y no te fijas en la viga que hay en el tuyo? ¿Cómo puedes decirle a tu hermano: "Hermano, déjame sacarte la paja de tu ojo", si no ves la viga que hay en el tuyo? ¡Hipócrita! Saca primero la viga de tu ojo y entonces verás bien para sacar la paja del ojo de tu hermano.»')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

-- ═══════════════════════════════════════════
-- SATURDAY Week 23: Luke 6:43-49
-- ═══════════════════════════════════════════
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 6, '', 'en', 'Lk 6:43-49',
'For there is no good tree that bringeth forth evil fruit; nor an evil tree that bringeth forth good fruit. For every tree is known by its fruit. For men do not gather figs from thorns; nor from a bramble bush do they gather the grape. A good man out of the good treasure of his heart bringeth forth that which is good: and an evil man out of the evil treasure bringeth forth that which is evil. For out of the abundance of the heart the mouth speaketh.

And why call you me, Lord, Lord; and do not the things which I say? Every one that cometh to me, and heareth my words, and doth them, I will shew you to whom he is like. He is like to a man building a house, who digged deep, and laid the foundation upon a rock: and when a flood came, the stream beat vehemently upon that house, and could not shake it; for it was founded on a rock.

But he that heareth, and doth not, is like to a man building his house upon the earth without a foundation: against which the stream beat vehemently, and immediately it fell, and the ruin of that house was great.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 6, '', 'en', 'Lk 6:43-49',
'For there is no good tree that bringeth forth evil fruit; nor an evil tree that bringeth forth good fruit. For every tree is known by its fruit. For men do not gather figs from thorns; nor from a bramble bush do they gather the grape. A good man out of the good treasure of his heart bringeth forth that which is good: and an evil man out of the evil treasure bringeth forth that which is evil. For out of the abundance of the heart the mouth speaketh.

And why call you me, Lord, Lord; and do not the things which I say? Every one that cometh to me, and heareth my words, and doth them, I will shew you to whom he is like. He is like to a man building a house, who digged deep, and laid the foundation upon a rock: and when a flood came, the stream beat vehemently upon that house, and could not shake it; for it was founded on a rock.

But he that heareth, and doth not, is like to a man building his house upon the earth without a foundation: against which the stream beat vehemently, and immediately it fell, and the ruin of that house was great.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('I', 'ordinary', 23, 6, '', 'es', 'Lc 6:43-49',
'No hay árbol bueno que dé frutos malos, ni árbol malo que dé frutos buenos. Cada árbol se conoce por su fruto: de los espinos no se recogen higos, ni de las zarzas se vendimian uvas. El hombre bueno saca el bien del buen tesoro de su corazón; y el malo saca el mal de su mal tesoro. Porque de la abundancia del corazón habla la boca.

¿Por qué me llaman: "Señor, Señor", y no hacen lo que digo? Les mostraré a quién se parece todo el que viene a mí y escucha mis palabras y las pone en práctica: se parece a un hombre que, al construir su casa, cavó hondo y puso los cimientos sobre roca. Vino la crecida, el río se precipitó sobre esa casa y no pudo derribarla, porque estaba bien construida.

Pero el que escucha y no actúa se parece a un hombre que construyó su casa sobre tierra sin cimientos: el río se precipitó sobre ella y enseguida se derrumbó, y la ruina de esa casa fue grande.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, gospel_ref, gospel_text)
VALUES ('II', 'ordinary', 23, 6, '', 'es', 'Lc 6:43-49',
'No hay árbol bueno que dé frutos malos, ni árbol malo que dé frutos buenos. Cada árbol se conoce por su fruto: de los espinos no se recogen higos, ni de las zarzas se vendimian uvas. El hombre bueno saca el bien del buen tesoro de su corazón; y el malo saca el mal de su mal tesoro. Porque de la abundancia del corazón habla la boca.

¿Por qué me llaman: "Señor, Señor", y no hacen lo que digo? Les mostraré a quién se parece todo el que viene a mí y escucha mis palabras y las pone en práctica: se parece a un hombre que, al construir su casa, cavó hondo y puso los cimientos sobre roca. Vino la crecida, el río se precipitó sobre esa casa y no pudo derribarla, porque estaba bien construida.

Pero el que escucha y no actúa se parece a un hombre que construyó su casa sobre tierra sin cimientos: el río se precipitó sobre ella y enseguida se derrumbó, y la ruina de esa casa fue grande.')
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  gospel_ref = EXCLUDED.gospel_ref,
  gospel_text = EXCLUDED.gospel_text;
