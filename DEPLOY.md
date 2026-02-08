# Guía de Despliegue

Este documento detalla el flujo de trabajo para guardar cambios y desplegar la aplicación.

## Flujo de Trabajo

1.  **Trabajar normalmente y subir a la organización:**
    
    Este comando sube tus cambios al repositorio principal (GitHub de la organización).
    
    ```bash
    git push origin main
    ```

2.  **Subir al espejo para que Vercel actualice:**
    
    Este comando sube tus cambios al repositorio personal que está conectado con Vercel para el despliegue automático.
    
    ```bash
    git push vercel-deploy main
    ```

> **Nota:** Asegúrate de haber hecho `git commit` antes de intentar subir los cambios.
