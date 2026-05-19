import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Lee .env.local
const env = readFileSync('.env.local', 'utf8')
const get = (key) => { const m = env.match(new RegExp(key + '=(.+)')); return m ? m[1].trim() : null }
const url = get('NEXT_PUBLIC_SUPABASE_URL')
const key = get('SUPABASE_SERVICE_ROLE_KEY')
if (!url || !key) { console.log('❌ Faltan variables en .env.local'); process.exit(1) }

const supabase = createClient(url, key)

// Inserta metadata directamente (no necesita SQL DDL)
const metadata = [
  {journal_slug:"CONFITEOR",lang:"es",description:"52 semanas para quien vuelve a la fe o la encuentra por primera vez. Un camino de conversión sin prisa.",opening_prayer:"Señor, vengo como soy — con mis dudas, mis heridas y mi hambre de algo verdadero. Abre mis ojos. Amén.",closing_prayer:"Padre, lo que escribí hoy es mi ofrenda imperfecta. Recíbela como recibiste al hijo pródigo: con los brazos abiertos. Amén."},
  {journal_slug:"CONFITEOR",lang:"en",description:"52 weeks for those returning to the faith or finding it for the first time. A path of conversion without rush.",opening_prayer:"Lord, I come as I am — with my doubts, my wounds, and my hunger for something true. Open my eyes. Amen.",closing_prayer:"Father, what I wrote today is my imperfect offering. Receive it as You received the prodigal son: with open arms. Amen."},
  {journal_slug:"EXAMEN_DEL_DIA",lang:"es",description:"120 días de examen ignaciano para hombres. Seis temas que recorren tu vida: trabajo, familia, servicio, cuerpo, vida espiritual y combate interior.",opening_prayer:"Ven, Espíritu Santo, ilumina los rincones de este día que no quiero ver. Dame ojos honestos. Amén.",closing_prayer:"Señor, este día fue tuyo aunque yo lo viví como mío. Guárdalo. Guárdame. Amén."},
  {journal_slug:"EXAMEN_DEL_DIA",lang:"en",description:"120 days of Ignatian examen for men. Six themes that traverse your life: work, family, service, body, spiritual life, and interior combat.",opening_prayer:"Come, Holy Spirit, illuminate the corners of this day I would rather not see. Give me honest eyes. Amen.",closing_prayer:"Lord, this day was Yours though I lived it as mine. Keep it. Keep me. Amen."},
  {journal_slug:"FIAT",lang:"es",description:"120 días de contemplación mariana para mujeres. María como modelo de oración, discernimiento y entrega.",opening_prayer:"María, madre y compañera de camino, enséñame tu sí. Que este tiempo de escritura sea también tiempo de escucha. Amén.",closing_prayer:"Madre, lo que escribí hoy ponlo a los pies de tu Hijo. Él sabe qué hacer con lo que yo no puedo resolver. Amén."},
  {journal_slug:"FIAT",lang:"en",description:"120 days of Marian contemplation for women. Mary as a model of prayer, discernment, and surrender.",opening_prayer:"Mary, mother and companion on the way, teach me your yes. May this time of writing also be a time of listening. Amen.",closing_prayer:"Mother, place what I wrote today at the feet of your Son. He knows what to do with what I cannot resolve. Amen."},
  {journal_slug:"FORTALEZA",lang:"es",description:"120 días de Teología del Cuerpo para hombres. Tu cuerpo como templo: deporte, alimentación, castidad, descanso, pantallas y relaciones.",opening_prayer:"Señor Jesucristo, Capitán de mi alma, fortalece mi cuerpo y mi voluntad. Que este diario sea trinchera, no vitrina. Amén.",closing_prayer:"Señor, hoy luché. No siempre gané. Pero estoy aquí, de pie, mirándote. Eso cuenta. Amén."},
  {journal_slug:"FORTALEZA",lang:"en",description:"120 days of Theology of the Body for men. Your body as temple: exercise, nutrition, chastity, rest, screens, and relationships.",opening_prayer:"Lord Jesus Christ, Captain of my soul, strengthen my body and my will. May this journal be a trench, not a display case. Amen.",closing_prayer:"Lord, today I fought. I did not always win. But I am here, standing, looking at You. That counts. Amen."},
  {journal_slug:"LUMEN",lang:"es",description:"52 semanas de luz para quienes buscan. Un diario para los que todavía no saben si creen pero quieren saber.",opening_prayer:"Dios — si estás ahí — ilumina lo que necesito ver hoy. No pido certezas. Pido luz. Amén.",closing_prayer:"Si algo de lo que escribí hoy es verdad, guárdalo. Si algo es mentira que me cuento a mí mismo, muéstramelo. Amén."},
  {journal_slug:"LUMEN",lang:"en",description:"52 weeks of light for seekers. A journal for those who do not yet know if they believe but want to find out.",opening_prayer:"God — if You are there — illuminate what I need to see today. I do not ask for certainty. I ask for light. Amen.",closing_prayer:"If anything I wrote today is true, keep it. If anything is a lie I tell myself, show me. Amen."},
  {journal_slug:"MAGNIFICAT",lang:"es",description:"120 días de Rosario meditativo para mujeres. Cada misterio hecho vida cotidiana, cada Ave María una conversación con la Madre.",opening_prayer:"María, Reina del Santo Rosario, toma mi mano. Que cada cuenta sea un paso más cerca de tu Hijo. Amén.",closing_prayer:"Madre, guarda estas palabras como guardaste las cosas de Jesús en tu corazón. Medítalas por mí cuando yo las olvide. Amén."},
  {journal_slug:"MAGNIFICAT",lang:"en",description:"120 days of meditative Rosary for women. Each mystery made daily life, each Hail Mary a conversation with the Mother.",opening_prayer:"Mary, Queen of the Holy Rosary, take my hand. May each bead be a step closer to your Son. Amen.",closing_prayer:"Mother, keep these words as you kept the things of Jesus in your heart. Ponder them for me when I forget. Amen."},
  {journal_slug:"MILES_CHRISTI",lang:"es",description:"90 días de combate espiritual. Para el hombre que sabe que está en guerra y necesita armadura, no motivación.",opening_prayer:"Señor de los ejércitos, vísteme con tu armadura. No vengo a este diario a sentirme bien. Vengo a pelear. Amén.",closing_prayer:"Señor, la batalla de hoy terminó. Mañana hay otra. Pero esta noche descanso en Ti como el soldado que duerme en la trinchera sabiendo que su Capitán vela. Amén."},
  {journal_slug:"MILES_CHRISTI",lang:"en",description:"90 days of spiritual combat. For the man who knows he is at war and needs armor, not motivation.",opening_prayer:"Lord of hosts, clothe me with Your armor. I do not come to this journal to feel good. I come to fight. Amen.",closing_prayer:"Lord, today's battle is over. Tomorrow brings another. But tonight I rest in You as a soldier sleeps in the trench knowing his Captain keeps watch. Amen."},
  {journal_slug:"PAZ_VERDADERA",lang:"es",description:"120 días de contemplación para mujeres. Seis temas que recorren tu vida interior: trabajo, familia, servicio, cuerpo, contemplación y paz.",opening_prayer:"Espíritu Santo, trae paz a este momento. No la paz del mundo que es ausencia de ruido. Tu paz — la que sostiene en medio de la tormenta. Amén.",closing_prayer:"Señor, recibe lo que escribí como incienso imperfecto. Tú conviertes mi barro en ofrenda. Amén."},
  {journal_slug:"PAZ_VERDADERA",lang:"en",description:"120 days of contemplation for women. Six themes that traverse your interior life: work, family, service, body, contemplation, and peace.",opening_prayer:"Holy Spirit, bring peace to this moment. Not the world's peace which is the absence of noise. Your peace — the kind that holds in the middle of the storm. Amen.",closing_prayer:"Lord, receive what I wrote as imperfect incense. You turn my clay into offering. Amen."},
  {journal_slug:"VERBUM",lang:"es",description:"120 días de Lectio Divina para hombres. Evangelios, Salmos, San Pablo, Antiguo Testamento, literatura sapiencial y Padres de la Iglesia.",opening_prayer:"Señor, abre mi entendimiento para que comprenda las Escrituras. No como quien estudia un texto sino como quien escucha a su Padre. Amén.",closing_prayer:"Tu Palabra no vuelve vacía. Que lo que leí hoy eche raíz aunque yo no lo note. Amén."},
  {journal_slug:"VERBUM",lang:"en",description:"120 days of Lectio Divina for men. Gospels, Psalms, Saint Paul, Old Testament, Wisdom literature, and Church Fathers.",opening_prayer:"Lord, open my understanding so I may comprehend the Scriptures. Not as one studying a text but as one listening to his Father. Amen.",closing_prayer:"Your Word does not return empty. May what I read today take root even if I do not notice. Amen."},
]

async function run() {
  // Intenta insertar metadata
  const { data, error } = await supabase.from('journal_metadata').upsert(metadata, { onConflict: 'journal_slug,lang' })
  if (error) {
    console.log('⚠️  Error insertando metadata: ' + error.message)
    console.log('')
    console.log('Probablemente la tabla journal_metadata no existe.')
    console.log('Copia y pega este SQL en Supabase Dashboard > SQL Editor > Run:')
    console.log('')
    console.log(`-- ====== PEGAR EN SUPABASE SQL EDITOR ======

-- 1. Crear tabla journal_metadata
CREATE TABLE IF NOT EXISTS journal_metadata (
  id bigint generated always as identity primary key,
  journal_slug text not null,
  lang text not null default 'es',
  description text,
  opening_prayer text,
  closing_prayer text,
  unique(journal_slug, lang)
);
ALTER TABLE journal_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read journal_metadata" ON journal_metadata FOR SELECT USING (true);

-- 2. Agregar columnas a journal_content si no existen
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS question_number integer DEFAULT 1;
ALTER TABLE journal_content ADD COLUMN IF NOT EXISTS section_type text DEFAULT 'question';

-- 3. Borrar constraint viejo y crear nuevo con question_number
ALTER TABLE journal_content DROP CONSTRAINT IF EXISTS journal_content_journal_slug_day_number_week_number_lang_key;
DROP INDEX IF EXISTS journal_content_unique_question;
CREATE UNIQUE INDEX journal_content_unique_question
  ON journal_content (journal_slug, COALESCE(day_number, 0), COALESCE(week_number, 0), lang, question_number);

-- ====== FIN ======`)
    console.log('')
    console.log('Después de correr el SQL, ejecuta este script de nuevo para insertar el metadata.')
  } else {
    console.log('✅ Metadata insertada: ' + metadata.length + ' filas (9 journals × 2 idiomas)')
  }
}

run().catch(console.error)
