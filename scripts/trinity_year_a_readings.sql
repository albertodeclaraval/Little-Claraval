-- ═══════════════════════════════════════════════════════════════
-- Santísima Trinidad — Año A (ciclo litúrgico 2025-2026, 2028-2029...)
-- Lecturas correctas para cycle='A':
--   Ex 34:4b-6, 8-9 / Dan 3:52-56 / 2 Co 13:11-13 / Jn 3:16-18
-- ═══════════════════════════════════════════════════════════════

INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text,
  psalm_ref,        psalm_text,
  second_reading_ref, second_reading_text,
  gospel_ref,       gospel_text)
VALUES (
  E'A', E'ordinary', 0, 0, E'trinity', E'es',
  E'Santísima Trinidad', E'white',

  E'Ex 34,4b-6.8-9',
  E'Moisés labró dos tablas de piedra semejantes a las primeras, madrugó y subió al monte Sinaí, tal como el Señor le había mandado, llevando en sus manos las dos tablas de piedra.\n\nEl Señor bajó en la nube, se puso junto a él y proclamó el nombre del Señor. El Señor pasó ante él y proclamó: «El Señor, el Señor, Dios compasivo y clemente, paciente, rico en amor y fidelidad.»\n\nMoisés se postró en tierra y adoró al Señor, y dijo: «Si de verdad gozo de tu favor, Señor, que el Señor camine en medio de nosotros. El pueblo es de dura cerviz; pero tú perdonarás nuestra culpa y nuestro pecado y nos tomarás como herencia tuya.»',

  E'Dn 3,52-56',
  E'Bendito eres, Señor, Dios de nuestros padres;\ntu nombre es digno de alabanza y gloria por los siglos.\nBendita tu gloria en tu lugar santo;\nes digna de himnos y gloria por los siglos.\nBendito eres en el templo de tu santa gloria;\ntu nombre es digno de alabanza y gloria por los siglos.\nBendito eres tú, que contemplas los abismos sentado sobre querubines;\ntu nombre es digno de alabanza y gloria por los siglos.\nBendito eres tú en el trono de tu reino;\ntu nombre es digno de alabanza y gloria por los siglos.',

  E'2 Co 13,11-13',
  E'En fin, hermanos, alegraos, buscad la perfección, animaos, tened un mismo sentir, vivid en paz; y el Dios de amor y de paz estará con vosotros. Saludáos los unos a los otros con el ósculo santo. Os saludan todos los santos. La gracia del Señor Jesucristo, el amor de Dios y la comunión del Espíritu Santo sean con todos vosotros.',

  E'Jn 3,16-18',
  E'Tanto amó Dios al mundo, que entregó a su Hijo único, para que todo el que crea en él no perezca, sino que tenga vida eterna. Porque Dios no envió a su Hijo al mundo para condenar al mundo, sino para que el mundo se salve por él. El que cree en él no es condenado; pero el que no cree ya está condenado, porque no ha creído en el nombre del Hijo único de Dios.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title               = EXCLUDED.title,
  liturgical_color    = EXCLUDED.liturgical_color,
  first_reading_ref   = EXCLUDED.first_reading_ref,
  first_reading_text  = EXCLUDED.first_reading_text,
  psalm_ref           = EXCLUDED.psalm_ref,
  psalm_text          = EXCLUDED.psalm_text,
  second_reading_ref  = EXCLUDED.second_reading_ref,
  second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref          = EXCLUDED.gospel_ref,
  gospel_text         = EXCLUDED.gospel_text;

-- English (DRA)
INSERT INTO lectionary (cycle, season, week, weekday, feast_key, lang, title, liturgical_color,
  first_reading_ref, first_reading_text,
  psalm_ref,        psalm_text,
  second_reading_ref, second_reading_text,
  gospel_ref,       gospel_text)
VALUES (
  E'A', E'ordinary', 0, 0, E'trinity', E'en',
  E'Most Holy Trinity', E'white',

  E'Ex 34:4b-6, 8-9',
  E'Moses cut out two tables of stone, such as had been before: and rising very early he went up into mount Sinai, as the Lord had commanded him, carrying with him the tables. And when the Lord was come down in a cloud, Moses stood with him, calling upon the name of the Lord. And when he passed before him, he said: O the Lord, the Lord God, merciful and gracious, patient and of much compassion, and true. And Moses making haste, bowed down prostrate unto the earth, and adoring, said: If I have found grace in thy sight, O Lord, I beseech thee, that thou wilt go with us, (for it is a stiffnecked people,) and take away our iniquities and sin, and possess us.',

  E'Dn 3:52-56',
  E'Blessed art thou, O Lord the God of our fathers, and worthy to be praised, and glorified, and exalted above all for ever: and blessed is the holy name of thy glory, and worthy to be praised, and exalted above all in all ages. Blessed art thou in the holy temple of thy glory, and exceedingly to be praised, and exceeding glorious for ever. Blessed art thou on the throne of thy kingdom, and worthy to be praised, and exalted above all for ever. Blessed art thou, who beholdest the depths, and sittest upon the cherubims, and art worthy to be praised and exalted above all for ever. Blessed art thou in the firmament of heaven, and worthy of praise, and glorious for ever.',

  E'2 Cor 13:11-13',
  E'For the rest, brethren, rejoice, be perfect, take exhortation, be of one mind, have peace; and the God of peace and of love shall be with you. Salute one another with a holy kiss. All the saints salute you. The grace of our Lord Jesus Christ, and the charity of God, and the communication of the Holy Ghost be with you all. Amen.',

  E'Jn 3:16-18',
  E'For God so loved the world, as to give his only begotten Son; that whosoever believeth in him, may not perish, but may have life everlasting. For God sent not his Son into the world, to judge the world, but that the world may be saved by him. He that believeth in him is not judged. But he that doth not believe, is already judged: because he believeth not in the name of the only begotten Son of God.'
)
ON CONFLICT (cycle, season, week, weekday, feast_key, lang) DO UPDATE SET
  title               = EXCLUDED.title,
  liturgical_color    = EXCLUDED.liturgical_color,
  first_reading_ref   = EXCLUDED.first_reading_ref,
  first_reading_text  = EXCLUDED.first_reading_text,
  psalm_ref           = EXCLUDED.psalm_ref,
  psalm_text          = EXCLUDED.psalm_text,
  second_reading_ref  = EXCLUDED.second_reading_ref,
  second_reading_text = EXCLUDED.second_reading_text,
  gospel_ref          = EXCLUDED.gospel_ref,
  gospel_text         = EXCLUDED.gospel_text;
