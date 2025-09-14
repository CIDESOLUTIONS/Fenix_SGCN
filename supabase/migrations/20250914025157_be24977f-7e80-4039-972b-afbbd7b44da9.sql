-- Limpiar solo los datos existentes sin crear usuarios ficticios
DELETE FROM process_strategy_evaluations;
DELETE FROM test_execution_steps;
DELETE FROM corrective_actions;
DELETE FROM continuity_tests;  
DELETE FROM continuity_plans;
DELETE FROM continuity_strategies;
DELETE FROM bia_assessments;
DELETE FROM risk_analysis;
DELETE FROM business_processes;
DELETE FROM strategy_criteria;
DELETE FROM compliance_requirements;
DELETE FROM compliance_framework;
DELETE FROM kpi_metrics;
DELETE FROM maintenance_activities;
DELETE FROM management_reviews;
DELETE FROM findings;
DELETE FROM profiles;