# Design Document

## Overview

Este documento describe el diseño técnico para migrar el portafolio HTML/CSS/JS a una aplicación React moderna con Supabase como backend. La arquitectura se basa en componentes React reutilizables, hooks personalizados para lógica de negocio, y una integración completa con Supabase para autenticación, base de datos y almacenamiento de archivos.

El diseño mantiene la separación de responsabilidades entre la capa de presentación (componentes React), la capa de lógica (hooks y servicios), y la capa de datos (Supabase). Se prioriza la reutilización de código, la escalabilidad y el mantenimiento del diseño visual exacto del portafolio actual.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)                  │  │
│  │                                                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │   Public     │  │    Admin     │  │  Projects   │ │  │
│  │  │   Routes     │  │   Routes     │  │   Routes    │ │  │
│  │  │  (/, /home)  │  │  