-- ═══════════════════════════════════════════════════════════════
-- Santísima Trinidad — Año A — Reflexión (4 movimientos)
-- Evangelio: Jn 3,16-18
-- Voz: dulce crudeza bernardina
-- ═══════════════════════════════════════════════════════════════

UPDATE lectionary_reflections
SET
  gospel_ref        = 'Jn 3,16-18',
  gospel_text       = 'Tanto amó Dios al mundo, que entregó a su Hijo único, para que todo el que crea en él no perezca, sino que tenga vida eterna. Porque Dios no envió a su Hijo al mundo para condenar al mundo, sino para que el mundo se salve por él. El que cree en él no es condenado; pero el que no cree ya está condenado, porque no ha creído en el nombre del Hijo único de Dios.',
  silence           = 'Detente ante esta palabra. El Padre habla aquí de entrega, no de cálculo. Recibe en silencio lo que no mereces y no esperabas.',
  meditative_phrase = 'Tanto amó Dios al mundo que entregó a su Hijo único.',
  inner_question    = '¿Vives como quien ha sido salvado, o como quien aún espera la sentencia?',
  brief_prayer      = 'Padre, me cuesta creer en la gratuidad de tanto amor. Que el nombre de tu Hijo Único —entregado por mí— abra lo que guardo cerrado. Que el mundo que tanto amaste incluya también este corazón mío.',
  reflexion         = 'Tanto amó Dios al mundo. No a los perfectos, no a los que ya creyeron. Al mundo en su distancia, en su dureza, en su indiferencia. Bernardo sabía que el amor que no puede ser rechazado no es amor verdadero. Y sin embargo aquí está la paradoja: el Hijo fue entregado sin condiciones, no para medir cuánto merecemos, sino para derribar la distancia. La crudeza de este versículo es que también incluye la otra orilla: quien no cree ya está condenado. No por castigo ajeno, sino por ausencia libremente elegida. Apartarse de la vida es ya la muerte. Y sin embargo el Padre no vino a condenar. Vino a salvar. Todo el peso del versículo cae sobre ese ''tanto''.',
  updated_at        = NOW()
WHERE feast_key = 'trinity'
  AND cycle     = 'A'
  AND lang      = 'es';
