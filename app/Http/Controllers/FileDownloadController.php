<?php


namespace App\Http\Controllers;

use App\Models\SubmissionFile;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileDownloadController extends Controller
{
    public function __invoke(SubmissionFile $file): StreamedResponse
    {
        $this->authorize('download', $file);

        return Storage::disk('public')->download(
            $file->file_path,
            $file->file_name
        );
    }
}
