const StatusBar = () => {
  return (
    <div className="rounded-b-3xl px-6 py-3 flex items-center justify-between text-white/90">
      <span className="text-sm font-medium">9:41</span>
      <div className="flex items-center gap-1">
        <span className="inline-block h-3 w-3 rounded-sm bg-white/80" />
        <span className="inline-block h-3 w-3 rounded-sm bg-white/60" />
        <span className="inline-block h-2 w-5 rounded-full bg-white/90" />
      </div>
    </div>
  )
}

export default StatusBar


