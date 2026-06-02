import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import { Nav } from '@/components/agentready/Nav';
import { Landing } from '@/components/agentready/Landing';
import { UploadDropzone } from '@/components/agentready/UploadDropzone';
import { ScanProgress } from '@/components/agentready/ScanProgress';
import { buildSampleReport } from '@/lib/readiness';
import { clearScanHistory, getScanHistory, saveScanHistory } from '@/lib/scanHistory';
import type { ReadinessReport, ScanHistoryItem } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useRepoScan } from '@/hooks/useRepoScan';

const ResultDashboard = lazy(() => import('@/components/agentready/ResultDashboard').then(module => ({ default: module.ResultDashboard })));

const Index = () => {
  const scan = useRepoScan();
  const [sampleReport, setSampleReport] = useState<ReadinessReport | null>(null);
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const savedReportKey = useRef<string | null>(null);
  const lastError = useRef<string | null>(null);
  const scanSectionRef = useRef<HTMLDivElement>(null);

  const activeReport = sampleReport || scan.report;
  const isScanning = scan.status === 'scanning';

  useEffect(() => {
    setHistory(getScanHistory());
  }, []);

  useEffect(() => {
    if (!scan.report) return;
    const key = `${scan.report.repoName}-${scan.report.scannedAt}`;
    if (savedReportKey.current === key) return;
    savedReportKey.current = key;
    setHistory(saveScanHistory(scan.report));
    queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [scan.report]);

  useEffect(() => {
    if (!scan.error || lastError.current === scan.error) return;
    lastError.current = scan.error;
    toast({
      title: scan.status === 'cancelled' ? 'Scan cancelled' : 'Scan blocked',
      description: scan.error,
      variant: scan.status === 'cancelled' ? 'default' : 'destructive',
    });
  }, [scan.error, scan.status]);

  const scrollScan = useCallback(() => {
    scanSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleFile = useCallback((file: File) => {
    setSampleReport(null);
    savedReportKey.current = null;
    lastError.current = null;
    void scan.startScan(file);
  }, [scan]);

  const handleGitHubImport = useCallback((url: string, branch?: string) => {
    setSampleReport(null);
    savedReportKey.current = null;
    lastError.current = null;
    void scan.startGitHubScan(url, branch);
  }, [scan]);

  const handleSample = useCallback(() => {
    scan.resetScan();
    const report = buildSampleReport();
    setSampleReport(report);
    setHistory(saveScanHistory(report));
    queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [scan]);

  const reset = useCallback(() => {
    scan.resetScan();
    setSampleReport(null);
    savedReportKey.current = null;
    lastError.current = null;
    queueMicrotask(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [scan]);

  const handleClearHistory = useCallback(() => {
    clearScanHistory();
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />

      {activeReport ? (
        <main className="pt-20">
          <Suspense fallback={<div className="container py-24 text-sm text-muted-foreground">Loading report...</div>}>
            <ResultDashboard report={activeReport} history={history} onReset={reset} onClearHistory={handleClearHistory} />
          </Suspense>
        </main>
      ) : (
        <main>
          <Landing onSampleReport={handleSample} onScrollScan={scrollScan} />

          <section id="scan" ref={scanSectionRef} className="container py-20 scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <div className="text-xs font-mono uppercase tracking-wider text-primary-glow mb-3">Scan</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Scan a repository</h2>
              <p className="text-muted-foreground mt-3">
                Upload a ZIP or import a public GitHub repository. Strip <span className="font-mono text-foreground/80">node_modules</span>, <span className="font-mono text-foreground/80">dist</span>, and <span className="font-mono text-foreground/80">build</span> folders for the smallest, cleanest scan.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {isScanning ? (
                <ScanProgress
                  steps={scan.steps}
                  currentStepIndex={scan.currentStepIndex}
                  progress={scan.progress}
                  warnings={scan.warnings}
                  onCancel={scan.cancelScan}
                />
              ) : (
                <>
                  <UploadDropzone onFile={handleFile} onGitHubImport={handleGitHubImport} />
                  {scan.status === 'cancelled' && (
                    <div className="mt-4 text-center text-sm text-muted-foreground">Scan cancelled.</div>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default Index;
