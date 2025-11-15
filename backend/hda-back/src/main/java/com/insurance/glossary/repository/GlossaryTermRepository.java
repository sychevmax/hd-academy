package com.insurance.glossary.repository;

import com.insurance.glossary.entity.GlossaryTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlossaryTermRepository extends JpaRepository<GlossaryTerm, Integer> {

    /**
     * Full-text search for Azure SQL / SQL Server using CONTAINS or LIKE
     */
    @Query(value = """
        SELECT * FROM glossary_terms 
        WHERE term ILIKE CONCAT('%', :searchText, '%')          
           OR abbreviation ILIKE CONCAT('%', :searchText, '%')
           OR synonyms ILIKE CONCAT('%', :searchText, '%')
        ORDER BY term ASC
        """, nativeQuery = true)
    List<GlossaryTerm> fullTextSearch(@Param("searchText") String searchText);

    /**
     * Alternative: Full-text search using SQL Server CONTAINS (requires full-text index)
     * Uncomment this and comment the above method if you have full-text indexing enabled
     */
    /*
    @Query(value = """
        SELECT * FROM glossary_terms
        WHERE CONTAINS((term, definition, abbreviation, synonyms), :searchText)
        ORDER BY term
        """, nativeQuery = true)
    List<GlossaryTerm> fullTextSearch(@Param("searchText") String searchText);
    */

    /**
     * Get all unique categories
     */
    @Query("SELECT DISTINCT g.category FROM GlossaryTerm g WHERE g.category IS NOT NULL ORDER BY g.category")
    List<String> findAllCategories();

    /**
     * Get terms by category
     */
    List<GlossaryTerm> findByCategoryOrderByTermAsc(String category);
}