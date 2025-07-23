#!/bin/bash
# setup-frontend.sh - Script para crear el frontend Next.js

echo "🚀 Creando frontend Next.js para AI-Agent-Lab..."

# Crear proyecto Next.js con TypeScript
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --no-src-dir \
  --import-alias "@/*"


# Instalar dependencias adicionales
echo "📦 Instalando dependencias..."

# UI y visualización
npm install @radix-ui/react-icons lucide-react
npm install react-flow-renderer reactflow
npm install framer-motion
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install clsx tailwind-merge class-variance-authority

# Estado y fetching
npm install @tanstack/react-query axios
npm install zustand

# Tipos para desarrollo
npm install -D @types/node

echo "✅ Instalación completa!"
echo ""
echo "📝 Estructura del proyecto:"
echo ""
echo "ai-agent-lab-frontend/"
echo "├── app/"
echo "│   ├── layout.tsx"
echo "│   ├── page.tsx"
echo "│   └── globals.css"
echo "├── components/"
echo "│   ├── ui/"
echo "│   ├── flow/"
echo "│   └── panels/"
echo "├── lib/"
echo "│   ├── api.ts"
echo "│   ├── types.ts"
echo "│   └── utils.ts"
echo "├── hooks/"
echo "└── store/"
echo ""
echo "🎯 Siguiente paso: cd ai-agent-lab-frontend && npm run dev"