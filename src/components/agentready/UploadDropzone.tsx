import { useCallback, useState, useRef } from 'react';
import { Github, Upload, FileArchive, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatFileSize, validateZipUpload } from '@/lib/uploadValidation';

interface Props {
  onFile: (file: File) => void;
  onGitHubImport?: (url: string, branch?: string) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFile, onGitHubImport, disabled }: Props) {
  const [mode, setMode] = useState<'zip' | 'github'>('zip');
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubBranch, setGithubBranch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = useCallback((f: File) => {
    const validation = validateZipUpload(f);
    if (!validation.valid) {
      setError(validation.error || 'That ZIP did not pass validation. Choose a repository .zip file under the local size limit.');
      setSelected(null);
      return;
    }
    setError(null);
    setSelected(f);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handle(f);
  };

  return (
    <div className="w-full">
      <div className="glass rounded-2xl p-2 mb-4 grid grid-cols-2 gap-2">
        <Button type="button" variant={mode === 'zip' ? 'default' : 'ghost'} onClick={() => { setMode('zip'); setError(null); }} disabled={disabled}>
          <FileArchive className="h-4 w-4 mr-2" /> Upload ZIP
        </Button>
        <Button type="button" variant={mode === 'github' ? 'default' : 'ghost'} onClick={() => { setMode('github'); setError(null); }} disabled={disabled}>
          <Github className="h-4 w-4 mr-2" /> Import from GitHub
        </Button>
      </div>

      {mode === 'zip' ? (
        <label
          htmlFor="agentready-file"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cn(
            'relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all p-10 text-center',
            'glass hover:border-primary/60 hover:bg-card/60',
            dragging && 'border-primary bg-primary/5 scale-[1.01]',
            !dragging && 'border-border/80',
            disabled && 'opacity-60 pointer-events-none'
          )}
        >
          <div className="mb-4 h-14 w-14 rounded-2xl bg-gradient-primary/20 border border-primary/30 flex items-center justify-center shadow-glow">
            <Upload className="h-6 w-6 text-primary-glow" />
          </div>
          <div className="font-display text-lg font-semibold">Drop your repository ZIP here</div>
          <div className="text-sm text-muted-foreground mt-1.5">or click to browse - max 25 MB, .zip only</div>
          <div className="text-xs text-muted-foreground/70 mt-4 max-w-md">
            ShipSeal does not execute uploaded code. Scanning runs in your browser on structure and metadata only.
          </div>
          {!selected && (
            <div className="mt-4 rounded-lg border border-border/60 bg-secondary/25 px-3 py-2 text-xs text-muted-foreground">
              No file selected yet. Choose a repository ZIP when you are ready.
            </div>
          )}
          <input
            ref={inputRef}
            id="agentready-file"
            type="file"
            accept=".zip"
            className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
          />
        </label>
      ) : (
        <div className={cn('glass rounded-2xl p-6', disabled && 'opacity-60 pointer-events-none')}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Github className="h-5 w-5 text-primary-glow" />
            </div>
            <div>
              <div className="font-display text-lg font-semibold">Import a public GitHub repo</div>
              <div className="text-sm text-muted-foreground">Paste a public GitHub repository URL or upload a ZIP.</div>
            </div>
          </div>
          <div className="space-y-3">
            <Input
              value={githubUrl}
              onChange={event => setGithubUrl(event.target.value)}
              placeholder="https://github.com/Csisz/shipseal"
              disabled={disabled}
            />
            <Input
              value={githubBranch}
              onChange={event => setGithubBranch(event.target.value)}
              placeholder="Optional branch, for example main"
              disabled={disabled}
            />
          </div>
          <div className="mt-4 text-xs text-muted-foreground/80 space-y-1">
            <div>Examples: <span className="font-mono text-foreground/80">https://github.com/Csisz/shipseal</span>, <span className="font-mono text-foreground/80">github.com/Csisz/shipseal</span>, or a <span className="font-mono text-foreground/80">.git</span> URL.</div>
            <div>Only public GitHub repositories are supported in the local MVP. Private repositories are not supported.</div>
            <div>Public GitHub import may be blocked by browser CORS restrictions in local mode. ZIP upload is the most reliable local MVP path.</div>
            <div>Local MVP note: if GitHub import is blocked, use Download ZIP on GitHub and upload it here.</div>
            {!githubUrl.trim() && <div className="text-accent">Enter a GitHub URL to enable import.</div>}
          </div>
          <Button
            className="mt-5 w-full sm:w-auto"
            onClick={() => onGitHubImport?.(githubUrl, githubBranch || undefined)}
            disabled={disabled || !githubUrl.trim()}
          >
            <Github className="h-4 w-4 mr-2" /> Import public repo
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-3 text-sm text-destructive">{error}</div>
      )}

      {selected && (
        <div className="mt-4 glass rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
            <FileArchive className="h-5 w-5 text-primary-glow" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{selected.name}</div>
            <div className="text-xs text-muted-foreground">{formatFileSize(selected.size)} - validated ZIP</div>
          </div>
          <Button
            variant="ghost" size="icon" type="button"
            onClick={() => { setSelected(null); if (inputRef.current) inputRef.current.value = ''; }}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button variant="default" onClick={() => selected && onFile(selected)} disabled={disabled}>
            Analyze repository
          </Button>
        </div>
      )}
    </div>
  );
}
