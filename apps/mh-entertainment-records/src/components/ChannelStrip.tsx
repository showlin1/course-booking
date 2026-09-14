const channels = ['YouTube', 'Spotify', 'TikTok', 'Instagram', 'Radio', 'Presse', 'Apple Music', 'Deezer'];

export default function ChannelStrip() {
  return (
    <div className="py-5 border-y border-border/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center gap-6 overflow-x-auto scrollbar-hide">
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground whitespace-nowrap font-bold uppercase flex-shrink-0">
          AU CŒUR DE VOTRE STRATÉGIE
        </span>
        {channels.map((ch) => (
          <span
            key={ch}
            className="text-sm font-bold text-muted-foreground/60 hover:text-primary transition-colors whitespace-nowrap cursor-default flex-shrink-0"
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
