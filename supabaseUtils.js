// Fonctions utilitaires pour la gestion de Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Chargement des variables d'environnement depuis le fichier key.env
dotenv.config({ path: './key.env' });

// Initialisation du client Supabase avec les clés d'environnement
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Teste la connexion à Supabase en effectuant une requête simple.
 * @throws {Error} Si la connexion échoue
 */
export async function testSupabaseConnection() {
    const { error } = await supabase.from('articlesUrl').select('id').limit(1);
    if (error) {
        throw new Error(`Test de connexion Supabase échoué : ${error.message}`);
    }
    console.log(`✅ Test de connexion Supabase réussi !`);
    return true;
}

/**
 * Récupere les urls des articles à Supabase.
 * @returns {Promise<Array<{url: string}>>} Liste des objets contenant les URLs d'article
 */
export async function getUrlArticle() {
    const { data: feeds, error } = await supabase.from('articlesUrl').select('url');
    if (error) {
        throw new Error(`Erreur lors de la récupération des flux depuis Supabase : ${error.message}`);
    }
    return feeds.map(f => ({ url: f.url }));

}

// Vérifie si deux articles existe deja
export async function articleExists(article) {
    const { data: existing, error } = await supabase
        .from('articles')
        .select('id')
        .eq('url', article)
        .maybeSingle();
    if (error) {
        throw new Error(`⚠️ Article deja renseigné : ${article} - ${error.message}`)
    }
    return !!existing;
}

// insertion base de donnée
export async function enregistrerArticle(article) {
    // Vérifie que la date est bien renseignée (optionnel : adapte selon tes besoins)
    if (!article.date) {
        console.warn(`⚠️ Article sans date, non inséré : ${article.url}`);
        return;
    }
    const existe = await articleExists(article.url);
    if (existe) {
        console.log(`⏭️ Article déjà présent : ${article.url}`);
        return;
    }

    const { data, error } = await supabase
        .from('articles')
        .insert([article])
        .select(); // Ajouté pour forcer le retour des données insérées

    if (error) {
        console.error("❌ Erreur d’insertion :", error.message, error.details || error);
    } else if (data && data[0]) {
        console.log("✅ Article inséré :", data[0].title);
    } else {
        console.log("⚠️ Insertion effectuée mais pas de retour de données pour :", article.url);
    }
}