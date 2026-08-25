import { Button } from "../../components/ui";
export function Pagination({
  page,
  pages,
  disabled,
  onPageChange,
}: {
  page: number;
  pages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <footer className="mt-4 flex items-center justify-between text-sm text-slate-500">
      <span>
        Sayfa {page} / {pages}
      </span>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="px-3 py-2"
          disabled={page === 1 || disabled}
          onClick={() => onPageChange(page - 1)}
        >
          Önceki
        </Button>

        <Button
          variant="secondary"
          className="px-3 py-2"
          disabled={page === pages || disabled}
          onClick={() => onPageChange(page + 1)}
        >
          Sonraki
        </Button>
      </div>
    </footer>
  );
}
