tailwind.config = {
    darkMode: "class",
    theme: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        body: ["Roboto", "sans-serif"],
        mono: ["ui-monospace", "monospace"],
      },
      extend: {
        colors: {
          'bg-crejo': '#141D37',
          'detail-crejo': '#FF1616',
          'tx-crejo': '#FFFFFF',
          'tx-2-crejo': '#677DB7',
          'tx-3-crejo': '#7D8570',
          'option-1': '#E85759',
          'option-2': '#6D707D',
          'option-3': '#838C95',
          'option-4': '#2C3C4C'
        }
      }
    },
    corePlugins: {
      preflight: false,
    },
  };